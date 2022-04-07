# -*- coding: utf-8 -*-
import json

from django.contrib.auth.models import Group
from django.shortcuts import redirect
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic import TemplateView
from rdmo.questions.models.catalog import Catalog
from rdmo.projects.views import ProjectAnswersView
from rest_framework import generics, permissions
from rest_framework.authentication import TokenAuthentication, BasicAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST
import random
import string

from config.settings.base import ANONYMOUS_PASS
from gfbio_dmpt.users.models import User
from gfbio_dmpt.utils.dmp_export import render_to_format
from .forms import DmptSupportForm
from .jira_utils import create_support_issue_in_view
from .models import DmptProject
from .permissions import IsOwner
from .serializers import DmptProjectSerializer


class CSRFViewMixin(View):
    @method_decorator(ensure_csrf_cookie)
    def get(self, request, *args, **kwargs):
        return super().get(self, request, *args, **kwargs)


# DMP React App in this template
class DmptFrontendView(CSRFViewMixin, TemplateView):
    template_name = "gfbio_dmpt_form/dmpt.html"

    def get(self, request, *args, **kwargs):
        user = self.request.user
        is_authenticated = user.is_authenticated
        if not user.is_authenticated:
            # TODO: annonymous need to be/have permission:
            #   (rdmo) group: api
            randpart = "".join(
                random.choice(string.ascii_uppercase + string.digits) for _ in range(20)
            )
            user, created = User.objects.get_or_create(
                username=f"anonymous-{randpart}",
                defaults={
                    "username": f"anonymous-{randpart}",
                    "password": ANONYMOUS_PASS,
                },
            )

        api_group = Group.objects.get(name="api")
        api_group.user_set.add(user)
        token, created = Token.objects.get_or_create(user_id=user.id)

        # NOTE: At the moment we locally use "GFBio test" and on the dev server we
        # have "GFBio DMP Catalog". That query thus is a little clumsy way of making
        # both work. In the end we should decide on how we want to handle the selection
        # of the catalog. Maybe add a field to let the dmp officer activate a catalog
        # this is then pulled out not matter which one it is and used here.
        catalog_id = Catalog.objects.filter(title_lang1__startswith="GFBio").first().id

        context = self.get_context_data(**kwargs)
        context["backend"] = {
            "isLoggedIn": "{}".format(is_authenticated).lower(),
            "token": "{}".format(token),
            "user_id": "{}".format(user.id),
            "user_name": "{}".format(user.username),
            "user_email": f"{user.email}",
            "catalog_id": catalog_id,
        }
        return self.render_to_response(context)


# This exports a GFBio branded DMP PDF
class DmpExportView(ProjectAnswersView):
    template_name = "gfbio_dmpt_export/dmp_export.html"
    # This is passing the request objects into the class so we can access and
    # modify the requesting user. This is needed as otherwise the checks in the
    # inheritec rdmo class ProjectAnswersView are not passed and we get
    # redirected to a login page when trying to download a dmp as anonymous
    # user.
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            # in order to ensure that not everybody can request any user
            # we make sure to only accept anonymous- pattern strings.
            randpart = request.GET.get("username").split("-", maxsplit=1)[1]
            try:
                user = User.objects.get(username=f"anonymous-{randpart}")
                self.request.user = user
                return super(DmpExportView, self).dispatch(request, *args, **kwargs)
            except:
                return redirect("/")

    def render_to_response(self, context, **response_kwargs):
        return render_to_format(
            self.request,
            self.kwargs["format"],
            "dmp_export",
            "gfbio_dmpt_export/dmp_export.html",
            context,
        )


class DmptProjectListView(generics.ListCreateAPIView):
    queryset = DmptProject.objects.all()
    serializer_class = DmptProjectSerializer
    authentication_classes = (TokenAuthentication, BasicAuthentication)
    permission_classes = (
        permissions.IsAuthenticated,
        IsOwner,
    )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        user = self.request.user
        return DmptProject.objects.filter(user=user).order_by("-modified")


class DmptProjectDetailView(generics.RetrieveAPIView):
    queryset = DmptProject.objects.all()
    serializer_class = DmptProjectSerializer
    authentication_classes = (TokenAuthentication, BasicAuthentication)
    permission_classes = (
        permissions.IsAuthenticated,
        IsOwner,
    )


class DmptSupportView(View):
    form_class = DmptSupportForm

    def post(self, request, *args, **kwargs):
        form = self.form_class(request.POST)
        if form.is_valid():
            result = create_support_issue_in_view(form.cleaned_data)
            return HttpResponse(status=HTTP_201_CREATED, content=json.dumps(result))
        else:
            return HttpResponse(
                status=HTTP_400_BAD_REQUEST, content=form.errors.as_json()
            )

# -*- coding: utf-8 -*-
import json
import random
import string

from django.contrib.auth.models import Group
from django.db.models import Prefetch
from django.http import HttpResponse
from django.shortcuts import redirect
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic import TemplateView
from rdmo.projects.models import Project, Value
from rdmo.projects.serializers.v1 import ProjectSerializer
from rdmo.projects.views import ProjectAnswersView
from rdmo.questions.models import QuestionSet
from rdmo.questions.models.catalog import Catalog
from rest_framework import generics, permissions
from rest_framework.authentication import TokenAuthentication, BasicAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_200_OK
from rest_framework.views import APIView

from config.settings.base import ANONYMOUS_PASS
from gfbio_dmpt.users.models import User
from gfbio_dmpt.utils.dmp_export import render_to_format
from .forms import DmptSupportForm
from .jira_utils import create_support_issue_in_view
from .models import DmptProject
from .permissions import IsOwner
from .serializers.dmpt_serializers import DmptProjectSerializer
from .serializers.extended_serializers import DmptSectionNestedSerializer


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
            print(form.cleaned_data)
            result = create_support_issue_in_view(form.cleaned_data)
            return HttpResponse(status=HTTP_201_CREATED, content=json.dumps(result))
        else:
            return HttpResponse(
                status=HTTP_400_BAD_REQUEST, content=form.errors.as_json()
            )


class DmptFormDataView(APIView):
    permission_classes = [AllowAny]

    # TODO: maybe model and/or serializer to serialize/deseralize data of requests

    def get(self, request, format=None):
        data = {'content': 'data'}
        # print(Catalog.objects.all())
        # for c in Catalog.objects.all():
        #     print(c, ' ', c.id)
        catalog_id = 18
        catalog = Catalog.objects.prefetch_related(
            'sections',
            Prefetch('sections__questionsets', queryset=QuestionSet.objects.filter(questionset=None).prefetch_related(
                'conditions',
                'questions',
                'questions__attribute',
                'questions__optionsets',
                'questionsets',
                'questions__optionsets__options',
            ))
        ).get(id=catalog_id)
        print(catalog)
        # print(catalog.sections.all())
        first_section = catalog.sections.first()
        # for s in catalog.sections.all():

        # TODO: for project detail view
        project = Project.objects.first()
        print('project available ', project)
        v = Value.objects.filter(project=project).first()
        print('first value for project ', v, ' | text: ', v.text, ' | attribute: ', v.attribute)
        serializer = ProjectSerializer(project)
        # print('p serializer ', serializer.data)
        print('\nfirst section', first_section)

        # questions.v1.serializer
        # s_data = SectionSerializer(first_section).data
        # ns_data = SectionNestedSerializer(first_section).data
        # print('section serializer data: ', s_data)
        # print('nested section serializer data: ', ns_data)
        # print('\n as json \n', JSONRenderer().render(ns_data))

        print('custom serializer data: ', DmptSectionNestedSerializer(first_section).data)

        # for qs in first_section.questionsets.all():
        #     print('\n\tquestion_set: ', qs, ' |  attribute: ', qs.attribute)
        #     # questions.v1.serializer
        #     # qs_data = QuestionSetSerializer(qs).data
        #     # print('\tqs serializer: ', qs_data)
        #     nqs_data = QuestionSetNestedSerializer(qs).data
        #     # print('\tnested qs serializer: ', nqs_data)
        #     for c in qs.conditions.all():
        #         print('\t\tcondition: ', c, ' |  source (attribute): ', c.source)
        #     for q in qs.questions.all():
        #         # TODO: for value, when requesting specific project, add manager to get singel val and catch exceptions
        #         # TODO: value.text for generic and text area, value.option for radio, select and checkbox
        #         print('\t\tquestion: ', q, ' |  widget_type: ', q.widget_type, ' |  attribute: ', q.attribute,
        #               ' | value available (for project): ',
        #               Value.objects.filter(project=project, attribute=q.attribute))
        #         for os in q.optionsets.all():
        #             print('\t\t\toption_set: ', os, ' | conditions: ', os.conditions.all())
        #             for o in os.options.all():
        #                 print('\t\t\t\toption: ', o)

        return Response(data, HTTP_200_OK)

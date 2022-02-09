# -*- coding: utf-8 -*-
from django.conf import settings
from django.contrib.auth.models import Group
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponseRedirect
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic import TemplateView

# jira integration
from jira import JIRA, JIRAError
from rdmo.projects.models import Project
from rdmo.projects.views import ProjectAnswersView
from rest_framework import generics, permissions
from rest_framework.authentication import TokenAuthentication, BasicAuthentication
from rest_framework.authtoken.models import Token

from config.settings.base import ANONYMOUS_PASS
from gfbio_dmpt.jira_integration.models import Ticket
from gfbio_dmpt.users.models import User
from gfbio_dmpt.utils.dmp_export import render_to_format
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
        print("view is authenticated ", is_authenticated)
        if not user.is_authenticated:
            # TODO: annonymous need to be/have permission:
            #   (rdmo) group: api
            user, created = User.objects.get_or_create(
                username="anonymous",
                defaults={"username": "anonymous", "password": ANONYMOUS_PASS},
            )
            print('created annonymous ', created)
        api_group = Group.objects.get(name="api")
        api_group.user_set.add(user)
        token, created = Token.objects.get_or_create(user_id=user.id)

        context = self.get_context_data(**kwargs)
        context["backend"] = {
            "isLoggedIn": "{}".format(is_authenticated).lower(),
            "token": "{}".format(token),
            "user_id": "{}".format(user.id),
        }
        return self.render_to_response(context)


# This exports a GFBio branded DMP PDF
class DmpExportView(ProjectAnswersView):
    model = Project
    template_name = "gfbio_dmpt_export/dmp_export.html"

    def render_to_response(self, context, **response_kwargs):
        return render_to_format(
            self.request,
            self.kwargs["format"],
            "dmp_export",
            "gfbio_dmpt_export/dmp_export.html",
            context,
        )


# A user should be able to request help on a dmp. This creates a ticket in
# Jira.
class DmpRequestHelp(View):

    # TODO:  <30-11-21, claas>
    # allow the user to provide some text with additional information
    # in that dialogue he can also select services which he is interested in?
    # this could be done in the template below. Just as an example. Or it could
    # be done using a form in the dmp template and then just pop up as a modal.

    def get(self, context, pk=None, **response_kwargs):

        project = Project.objects.get(id=pk)
        try:
            if project.ticket:
                # TODO: <30-11-21, claas>
                # we should return to the user profile instead or remove
                # this completely as this might hinder the use of the
                # view with the react frontend.
                return HttpResponseRedirect("/")
        except ObjectDoesNotExist as e:
            # TODO: <18-11-21, claas> # this needs to go to logging later
            print("A ticket does not exist:")
            print("---------------------------")
            print(e)

        # initialize the jira client
        jira = JIRA(
            server=settings.JIRA_URL,
            basic_auth=(settings.JIRA_USERNAME, settings.JIRA_PASS),
        )

        # get the title and the catalogue the user is requesting help for
        summary = project.title
        catalog = project.catalog
        reporting_user = jira.search_users(user=settings.JIRA_DEFAULT_REPORTER_EMAIL)[
            0
        ].name

        # TODO:  <29-11-21, Claas>
        # we should have a handling for users not being logged in.
        # The email should then be taken from the form the user fills out
        # in the dmp frontend before asking for help
        if context.user.is_authenticated:
            try:
                # TODO:  <30-11-21, claas>
                # a user should be identified by his gostern id when he is logged in and not by the
                # email
                reporting_user = jira.search_users(user=context.user.email)[0].name
            except:
                reporting_user = jira.search_users(
                    user=settings.JIRA_DEFAULT_REPORTER_EMAIL
                )[0].name

        try:
            # TODO:  <29-11-21, Claas>
            # Find the correct issue type
            if context.user.is_authenticated:
                new_issue = jira.create_issue(
                    project=settings.JIRA_PROJECT,
                    summary=summary,
                    description=f"Would you please be so nice and help me with my dmp named '{summary}' using the {catalog} catalog",
                    reporter={"name": reporting_user},
                    issuetype={"name": "Data Submission"},
                )
            else:
                new_issue = jira.create_issue(
                    project=settings.JIRA_PROJECT,
                    summary=summary,
                    description=f"Would you please so nice and help me with that dmp using the {catalog} catalog",
                    issuetype={"name": "Data Submission"},
                )

            Ticket.objects.create(
                project=project, ticket_key=new_issue.key, ticket_id=new_issue.id
            )

        except JIRAError as e:
            # TODO: <18-11-21, claas> # this needs to go to logging later
            print("The ticket creation failed:")
            print("---------------------------")
            print(e.text)

        # TODO: <30-11-21, claas>
        # we should return to the user profile instead or remove
        # this completely as this might hinder the use of the
        # view with the react frontend.
        return HttpResponseRedirect("/")


class DmptProjectListView(generics.ListCreateAPIView):
    queryset = DmptProject.objects.all()
    serializer_class = DmptProjectSerializer
    authentication_classes = (TokenAuthentication, BasicAuthentication)
    permission_classes = (permissions.IsAuthenticated, IsOwner,)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    permission_classes = (
        permissions.IsAuthenticated,
        IsOwner,
    )

    def get_queryset(self):
        user = self.request.user
        return DmptProject.objects.filter(user=user).order_by("-modified")


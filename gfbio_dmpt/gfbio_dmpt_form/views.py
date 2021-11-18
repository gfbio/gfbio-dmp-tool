# -*- coding: utf-8 -*-
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic import TemplateView

#  from rdmo.core.utils import render_to_format
from rdmo.projects.models import Project
from rdmo.projects.views import ProjectAnswersView
from rest_framework import generics, mixins, permissions
from rest_framework.authentication import TokenAuthentication, BasicAuthentication

# jira integration
from jira import JIRA, JIRAError
from gfbio_dmpt.utils.dmp_export import render_to_format
from django.http import HttpResponseRedirect
from django.conf import settings


class CSRFViewMixin(View):
    @method_decorator(ensure_csrf_cookie)
    def get(self, request, *args, **kwargs):
        return super().get(self, request, *args, **kwargs)


# class DmptProjectsView(mixins.ListModelMixin,):
#     queryset = rdmo.projects.models.Project.objects.all()
#     authentication_classes = (TokenAuthentication, BasicAuthentication)
#     permission_classes = (permissions.IsAuthenticated,)
#                           # IsOwnerOrReadOnly)

# React App in this template
class DmptFrontendView(CSRFViewMixin, TemplateView):
    template_name = "gfbio_dmpt_form/dmpt.html"

    def get(self, request, *args, **kwargs):
        print("DMPTFRONTENDVIEW user logged in ", request.user.is_anonymous)
        print(request.user.is_authenticated)
        context = self.get_context_data(**kwargs)
        context["backend"] = {
            "isLoggedIn": "{}".format(request.user.is_authenticated).lower(),
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


# a user should be able to request help on a dmp
class DmpRequestHelp(TemplateView):

    # TODO:

    # allow the user to provide some text with additional information
    # in that dialogue he can also select services which he is interested in?
    # this could be done in the template below. Just as an example. Or it could
    # be done using a form in the dmp template and then just pop up as a modal.

    # we get the project information form rdmo
    model = Project

    template_name = "gfbio_dmpt_form/dmpt.html"

    # with a button click the issue is generated
    def get(self, context, pk=None, **response_kwargs):

        # initialize jira client
        jira = JIRA(
            server = settings.JIRA_URL,
            basic_auth=(settings.JIRA_USERNAME,
                        settings.JIRA_PASS),
        )

        # when the user is logged in we can hand over stuff to the ticket 
        if context.user.is_authenticated:
            # find the user in jira with goestern id or email
            try:
                # find out if this is the correct field
                user_asking_for_help = context.user.external_user_id
            except AttributeError:
                user_asking_for_help = jira.search_users(user="Claas-Thido.Pfaff@gfbio.org")[0].name

        # when creating a help ticket there is different options. When the user
        # is not logged in we cannot associate the ticket with the username or
        # email in jira. If he however is logged in we can adjust that

        # get the project from the configuration. when we have development
        # running then we go for SAND and when we are in production we go for
        # the HELP space in Jira.

        # this returns a <JIRA Issue: key='SAND-1863', id='20027'> store that
        # information in the database so we have a reference for it.

        # project title to request help for
        #  title = self.model.objects.first().title
        #  catalog = self.model.objects.first().catalog
        title = self.model.objects.get(id=pk).title
        catalog = self.model.objects.get(id=pk).catalog

        try:

            if context.user.is_authenticated:
                new_issue = jira.create_issue(
                    project="SAND",
                    summary=title,
                    description=f"Would you please so nice and help me with that dmp using the {catalog} catalog",
                    reporter={"name": user_asking_for_help},
                    issuetype={"name": "Data Submission"},
                )
            else:
                new_issue = jira.create_issue(
                    project="SAND",
                    summary=title,
                    description=f"Would you please so nice and help me with that dmp using the {catalog} catalog",
                    issuetype={"name": "Data Submission"},
                )

        except JIRAError as e:
            # TODO: <18-11-21, claas> # this needs to go to logging later
            print("The ticket creation failed:")
            print("---------------------------")
            print(e.text)

        # TODO:  <18-11-21, claas> # redirect back to the users profile
        return HttpResponseRedirect("/")

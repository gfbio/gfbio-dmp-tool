# -*- coding: utf-8 -*-
import json
import random
import string
import time

from django.contrib.auth.models import Group
from django.http import HttpResponse
from django.shortcuts import redirect
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic import TemplateView
from rdmo.options.models import Option
from rdmo.projects.models import Project, Value
from rdmo.projects.views import ProjectAnswersView
from rdmo.questions.models import Question
from rdmo.questions.models.catalog import Catalog
from rest_framework import generics, permissions, mixins
from rest_framework.authentication import TokenAuthentication, BasicAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_200_OK

from config.settings.base import ANONYMOUS_PASS
from gfbio_dmpt.users.models import User
from gfbio_dmpt.utils.dmp_export import render_to_format
from .forms import DmptSupportForm
from .jira_utils import create_support_issue_in_view
from .models import DmptProject
from .permissions import IsOwner
from .rdmo_db_utils import get_catalog_with_sections, build_form_content
from .serializers.dmpt_serializers import (
    DmptProjectSerializer,
    RdmoProjectSerializer,
    RdmoProjectValuesSerializer, RdmoProjectValuesUpdateSerializer,
)
from .serializers.extended_serializers import (
    DmptSectionNestedSerializer,
    DmptSectionSerializer,
)


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
        print("\nBACKEND ", context["backend"])
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
            try:
                randpart = request.GET.get("username").split("-", maxsplit=1)[1]
                user = User.objects.get(username=f"anonymous-{randpart}")
                request.user = user
            except:
                return redirect("/")
        return super(DmpExportView, self).dispatch(request, *args, **kwargs)

    def render_to_response(self, context, **response_kwargs):
        return render_to_format(
            self.request,
            self.kwargs["format"],
            "dmp_export",
            "gfbio_dmpt_export/dmp_export.html",
            context,
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


# REFACTORING BELOW --------------------------------------------------------------

# TODO: add issue key to serialization when available. to show in list in frontend
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


class DmptProjectDetailView(mixins.RetrieveModelMixin, generics.GenericAPIView):
    queryset = DmptProject.objects.all()
    serializer_class = DmptProjectSerializer
    authentication_classes = (TokenAuthentication, BasicAuthentication)
    permission_classes = (
        permissions.IsAuthenticated,
        IsOwner,
    )

    def get(self, request, *args, **kwargs):
        response = self.retrieve(request, *args, **kwargs)
        obj = self.get_object()
        form_data = {}
        try:
            catalog_id = (
                None if not obj.rdmo_project.catalog else obj.rdmo_project.catalog.id
            )
            catalog = get_catalog_with_sections(catalog_id)
            form_data = build_form_content(catalog.sections.all(), obj)
        except Catalog.DoesNotExist as e:
            pass
        response.data["form_data"] = form_data
        return response


class RdmoProjectCreateView(generics.CreateAPIView):
    serializer_class = RdmoProjectSerializer


class DmptRdmoProjectCreateView(generics.GenericAPIView):
    authentication_classes = (TokenAuthentication, BasicAuthentication)
    permission_classes = (
        permissions.IsAuthenticated,
        IsOwner,
    )

    @staticmethod
    def _create_text_value(text_value, project_id, question_id):
        print('_create_text_value | question_id : ', question_id)
        try:
            question = Question.objects.get(id=question_id)
            Value.objects.create(
                project_id=project_id,
                attribute=question.attribute,
                text=text_value,
                value_type=question.value_type,
                unit=question.unit,
            )
        except Question.DoesNotExist as e:
            pass

    @staticmethod
    def _create_option_value(option_value, project_id, question_id):
        print('_create_option_value | question_id : ', question_id)
        try:
            question = Question.objects.get(id=question_id)
            option = Option.objects.get(id=int(option_value))
            Value.objects.create(
                project_id=project_id,
                attribute=question.attribute,
                option=option,
                value_type=question.value_type,
                unit=question.unit,
            )
        except Question.DoesNotExist as e:
            pass
        except Option.DoesNotExist as oe:
            pass

    def _create_values_from_form_data(self, form_data, project_id):
        print('_create_values_from_form_data ', form_data, ' | project id ', project_id)
        separator = "____"
        for form_field in form_data:
            print('form_field : ', form_field)
            sub_fields = form_field.split(separator)

            # question_key = form_field
            # # this applies to option-247 and optionset-54
            if form_field.startswith("option") and len(sub_fields) == 3:
                # sub_fields = form_field.split(separator)
                # if len(sub_fields) == 3:
                question_id = sub_fields[2]
                self._create_option_value(form_data[form_field], project_id, question_id)
                continue
            elif len(sub_fields) == 2:
                question_id = sub_fields[1]
                self._create_text_value(form_data[form_field], project_id, question_id)
                continue
            else:
                continue

    def _update_values_from_form_data(self, form_data, dmpt_project):
        related_values = dmpt_project.rdmo_project.values.all()
        related_values.delete()
        self._create_values_from_form_data(form_data, dmpt_project.rdmo_project.id)
        # 0. strictly: what comes via a put request ressemble the new state of objects
        #   thus delete values and create new ones should be ok, and may be a lot easier
        #    below is more like patch request

        # 1. if there is no value for this question, but a key from the form is available,
        #   this means to create a new value, like in the initial post method

        # 2. if there is/are values for this question and a key from the form is available
        #   this means that a) the value needs update in cases of text values. b) a change in
        #   which option is selected in case of radio/select/checkbox. c) a delete of a value
        #   if the formerly selected option in now de-selected e.g. no checkbox checked anymore

    def post(self, request, format=None):
        serializer = RdmoProjectValuesSerializer(data=request.data)
        if serializer.is_valid():
            catalog = Catalog.objects.get(id=serializer.data.get("catalog"))
            project = Project.objects.create(
                catalog=catalog, title=serializer.data.get("title")
            )

            form_data = serializer.data.get("form_data", {})
            self._create_values_from_form_data(form_data, project.id)

            data = serializer.data
            data["rdmo_project_id"] = project.id

            return Response(data=data, status=HTTP_201_CREATED)

        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

    def put(self, request, format=None):
        serializer = RdmoProjectValuesUpdateSerializer(data=request.data)
        if serializer.is_valid():
            dmpt_project = DmptProject.objects.get(id=serializer.data.get("dmpt_project"))
            dmpt_project.rdmo_project.title = serializer.data.get("title")
            dmpt_project.rdmo_project.save()

            form_data = serializer.data.get("form_data", {})
            self._update_values_from_form_data(form_data, dmpt_project)

            data = serializer.data
            data["rdmo_project_id"] = dmpt_project.rdmo_project.id

            return Response(data=data, status=HTTP_200_OK)

        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


class DmptSectionListView(generics.GenericAPIView):
    authentication_classes = (TokenAuthentication, BasicAuthentication)
    permission_classes = (
        permissions.IsAuthenticated,
        IsOwner,
    )

    def get(self, request, catalog_id):
        try:
            catalog = Catalog.objects.prefetch_related("sections").get(id=catalog_id)
        except Catalog.DoesNotExist as e:
            return Response(data=f"{e}", status=HTTP_400_BAD_REQUEST)
        sections = catalog.sections.all()
        serializer = DmptSectionSerializer(sections, many=True)
        return Response(data=serializer.data, status=HTTP_200_OK)


# class DmptProjectFormDataView(generics.GenericAPIView):
#     authentication_classes = (TokenAuthentication, BasicAuthentication)
#     permission_classes = (
#         permissions.IsAuthenticated,
#         IsOwner,
#     )

# TODO: maybe it is better to access section directly via id, since we now work with section tab navi in react app
class DmptSectionDetailView(generics.GenericAPIView):
    # TODO: maybe this view becomes restricted
    # permission_classes = [AllowAny]
    authentication_classes = (TokenAuthentication, BasicAuthentication)
    permission_classes = (
        permissions.IsAuthenticated,
        IsOwner,
    )

    def get(self, request, catalog_id, section_index, format="json"):
        try:
            catalog = get_catalog_with_sections(catalog_id)
        except Catalog.DoesNotExist as e:
            return Response(data=f"{e}", status=HTTP_400_BAD_REQUEST)

        sections = catalog.sections.all()
        if section_index >= len(sections):
            return Response(
                data=f"faulty index: {section_index}", status=HTTP_400_BAD_REQUEST
            )

        serializer = DmptSectionNestedSerializer(sections[section_index])
        return Response(data=serializer.data, status=HTTP_200_OK)

        # prototyping below ------------------------------
        # # print(Catalog.objects.all())
        # # for c in Catalog.objects.all():
        # #     print(c, ' ', c.id)
        # catalog_id = 18
        # catalog = Catalog.objects.prefetch_related(
        #     'sections',
        #     Prefetch('sections__questionsets', queryset=QuestionSet.objects.filter(questionset=None).prefetch_related(
        #         'conditions',
        #         'questions',
        #         'questions__attribute',
        #         'questions__optionsets',
        #         'questionsets',
        #         'questions__optionsets__options',
        #     ))
        # ).get(id=catalog_id)
        # print(catalog)
        # # print(catalog.sections.all())
        # first_section = catalog.sections.all()[3]
        # # for s in catalog.sections.all():
        #
        # # TODO: for project detail view
        # project = Project.objects.first()
        # print('project available ', project)
        # v = Value.objects.filter(project=project).first()
        # print('first value for project ', v, ' | text: ', v.text, ' | attribute: ', v.attribute)
        # serializer = ProjectSerializer(project)
        # # print('p serializer ', serializer.data)
        # print('\nfirst section', first_section)
        #
        # # questions.v1.serializer
        # # s_data = SectionSerializer(first_section).data
        # # ns_data = SectionNestedSerializer(first_section).data
        # # print('section serializer data: ', s_data)
        # # print('nested section serializer data: ', ns_data)
        # # print('\n as json \n', JSONRenderer().render(ns_data))
        # data = DmptSectionNestedSerializer(first_section).data
        # print('custom serializer data: ', )
        # print(JSONRenderer().render(data))
        #
        # # for qs in first_section.questionsets.all():
        # #     print('\n\tquestion_set: ', qs, ' |  attribute: ', qs.attribute)
        # #     # questions.v1.serializer
        # #     # qs_data = QuestionSetSerializer(qs).data
        # #     # print('\tqs serializer: ', qs_data)
        # #     nqs_data = QuestionSetNestedSerializer(qs).data
        # #     # print('\tnested qs serializer: ', nqs_data)
        # #     for c in qs.conditions.all():
        # #         print('\t\tcondition: ', c, ' |  source (attribute): ', c.source)
        # #     for q in qs.questions.all():
        # #         # TODO: for value, when requesting specific project, add manager to get singel val and catch exceptions
        # #         # TODO: value.text for generic and text area, value.option for radio, select and checkbox
        # #         print('\t\tquestion: ', q, ' |  widget_type: ', q.widget_type, ' |  attribute: ', q.attribute,
        # #               ' | value available (for project): ',
        # #               Value.objects.filter(project=project, attribute=q.attribute))
        # #         for os in q.optionsets.all():
        # #             print('\t\t\toption_set: ', os, ' | conditions: ', os.conditions.all())
        # #             for o in os.options.all():
        # #                 print('\t\t\t\toption: ', o)

        # return Response(data={}, status=HTTP_200_OK)

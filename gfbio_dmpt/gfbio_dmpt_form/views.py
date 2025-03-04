# -*- coding: utf-8 -*-
import json
import random
import string

from django.contrib.auth.models import Group
from django.contrib.sites.shortcuts import get_current_site
from django.http import HttpResponse
from django.shortcuts import redirect
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic import TemplateView
from rdmo.options.models import Option
from rdmo.projects.models import Project, Value, Membership
from rdmo.projects.views import ProjectAnswersView
from rdmo.questions.models import Question, Section
from rdmo.questions.models.catalog import Catalog
from rdmo.questions.serializers.v1 import SectionSerializer
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
from .models import DmptProject, DmptCatalog
from .permissions import IsOwner
from .rdmo_db_utils import build_form_content, get_mandatory_form_fields
from .serializers.dmpt_serializers import (
    DmptProjectSerializer,
    RdmoProjectSerializer,
    RdmoProjectValuesSerializer, RdmoProjectValuesUpdateSerializer,
)
from .utils.prepare_section_data import get_section_data
from django.db.models import Prefetch

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
        id = kwargs.get('id', None)

        if not is_authenticated:
            user = self._create_anonymous_user()

        self._ensure_user_in_api_group(user)
        token = self._get_user_token(user)

        catalog_id = self._determine_catalog_id(id)

        context = self.get_context_data(**kwargs)
        context["backend"] = {
            "isLoggedIn": str(is_authenticated).lower(),
            "token": str(token),
            "user_id": str(user.id),
            "user_name": str(user.username),
            "user_email": str(user.email),
            # TODO: change after testing
            "catalog_id": catalog_id,
            # "catalog_id": 18,

        }

        return self.render_to_response(context)

    def _create_anonymous_user(self):
        randpart = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(20))
        user, created = User.objects.get_or_create(
            username=f"anonymous-{randpart}",
            defaults={"password": ANONYMOUS_PASS}
        )
        return user

    def _ensure_user_in_api_group(self, user):
        api_group, created = Group.objects.get_or_create(name="api")
        api_group.user_set.add(user)

    def _get_user_token(self, user):
        token, created = Token.objects.get_or_create(user=user)
        return token

    def _determine_catalog_id(self, id):
        catalog_id = None
        if id:
            try:
                project = DmptProject.objects.get(id=id)
                rdmo_project = Project.objects.get(id=project.rdmo_project_id)
                catalog_id = rdmo_project.catalog_id
            except DmptProject.DoesNotExist:
                return HttpResponse("Project not found", status=404)
            except Project.DoesNotExist:
                return HttpResponse("RDMO Project not found", status=404)
        else:
            catalog_id = self._get_default_catalog_id()
        return catalog_id

    # FIXME: DASS-2203 broken due to update to rdmo 2
    # TODO: discuss approach in general, is this part of the versioning workflow for jimena ?
    def _get_default_catalog_id(self):
        default_selected_catalog = DmptCatalog.objects.filter(active=True).first()
        if default_selected_catalog:
            catalog_id = default_selected_catalog.catalog.id
        else:
            first_catalog = Catalog.objects.first()
            catalog_id = first_catalog.id if first_catalog else None
        return catalog_id


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

    def get_context_data(self, **kwargs):
        import logging
        from rdmo.questions.models import Section
        from rdmo.projects.models import Value
        from rdmo.domain.models import Attribute
        logger = logging.getLogger(__name__)
        context = super().get_context_data(**kwargs)
        project = context.get('project')
        
        if project:
            # Add project to context for template tags
            context['project'] = project
            
            # Log initial section information
            catalog = project.catalog
            
            # Get sections through catalog_section relationship and order by the CatalogSection order field
            sections = Section.objects.filter(
                catalogs=catalog
            ).prefetch_related(
                'pages', 
                'pages__questions'
            ).order_by(
                'section_catalogs__order'  # This joins through CatalogSection to get the proper order
            )
            
            logger.info(f"DmpExportView: project id {project.id}, found {sections.count()} sections from catalog {catalog.uri}")
            
            # Log detailed section information
            logger.info("Section ordering details:")
            for section in sections:
                logger.info(f"Section: {section.uri}")
                logger.info(f"  Order in Catalog: {section.section_catalogs.get(catalog=catalog).order}")
                logger.info(f"  Title: {section.title_lang1}")
                
                # Get pages for this section (through section_pages)
                for page in section.pages.all():
                    # Get questions for this page
                    for question in page.questions.all():
                        if hasattr(question, 'attribute'):
                            # Get values for this question's attribute
                            values = Value.objects.filter(
                                project=project,
                                attribute=question.attribute
                            ).select_related('attribute', 'option').order_by('set_index', 'collection_index')
                            
                            value_texts = [
                                v.text or getattr(v.option, 'text', '') 
                                for v in values
                            ]
                            logger.info(f"  Question: {question.attribute.uri if hasattr(question, 'attribute') else 'N/A'}")
                            logger.info(f"    Values: {value_texts}")
                            if values:
                                logger.info(f"    First Value Details: set_index={values[0].set_index}, collection_index={values[0].collection_index}")
            
            # Patch the project object with methods needed by RDMO template tags
            if not hasattr(project, '_get_values'):
                def _get_values(self, attribute_uri, set_prefix=None, set_index=None, index=None):
                    logger.debug(f'Getting values for {attribute_uri} (set_prefix={set_prefix}, set_index={set_index}, index={index})')
                    
                    try:
                        # Get values from project's Value set
                        values = Value.objects.filter(
                            project=project,
                            attribute__uri=attribute_uri
                        ).select_related('option', 'attribute', 'attribute__section')
                        
                        if set_prefix:
                            values = values.filter(set_prefix=set_prefix)
                        
                        logger.info(f"Processing values for {attribute_uri}")
                        
                        # Use consistent RDMO-style ordering regardless of set_index presence
                        values = values.order_by('set_index', 'collection_index')
                        
                        # Log ordering details for troubleshooting
                        for val in values:
                            logger.info(f"Value {val.id} - Set: {val.set_index}, Collection: {val.collection_index}, "
                                      f"URI: {val.attribute.uri}")
                        
                        # Convert values to dictionary format
                        result = []
                        for value in values:
                            val_dict = {
                                'text': value.text,
                                'option': value.option,
                                'value': value.value,
                                'value_and_unit': value.value_and_unit,
                                'is_true': value.is_true,
                                'is_false': value.is_false
                            }
                            result.append(val_dict)
                            
                        # Log the values being returned for debugging
                        logger.info("=============================================================================================")
                        logger.info(f'Found values for {attribute_uri}: {[(v["text"], v["option"].text if v["option"] else None) for v in result]}')
                        logger.info("=============================================================================================")
                        
                        return result if result else []
                        
                    except Exception as e:
                        logger.error(f'Error getting values for {attribute_uri}: {str(e)}')
                        return []
                
                # Bind the method to the project instance
                import types
                project._get_values = types.MethodType(_get_values, project)
                logger.info('Patched _get_values method onto project instance')

            # Get sections from the project's catalog
            if project.catalog:
                # Get sections with their related pages and questions, properly ordered
                sections = project.catalog.sections.all().order_by('section_catalogs__order')
                
                # Create a structure that ensures proper ordering of sections, pages, and questions
                ordered_sections = []
                for section in sections:
                    logger.info(f'Section: {section.uri}')
                    logger.info(f'  Title: {section.title_lang1}')
                    logger.info(f'  Order in Catalog: {section.section_catalogs.get(catalog=project.catalog).order}')
                    
                    # Get pages ordered through the section_pages relation (using SectionPage model's 'order' field)
                    section_pages = section.section_pages.all().order_by('order')
                    ordered_pages = [sp.page for sp in section_pages]
                    
                    logger.info(f'  Pages count: {len(ordered_pages)}')
                    
                    for page in ordered_pages:
                        logger.info(f'  Page: {page.uri}')
                        logger.info(f'    Title: {page.title_lang1}')
                        
                        # Get questions ordered through the page_questions relation (using PageQuestion model's 'order' field)
                        page_questions = page.page_questions.all().order_by('order')
                        ordered_questions = [pq.question for pq in page_questions]
                        
                        logger.info(f'    Questions count: {len(ordered_questions)}')
                        
                        # Add ordered questions to this page
                        page.ordered_questions = ordered_questions
                    
                    # Add ordered pages to this section
                    section.ordered_pages = ordered_pages
                    ordered_sections.append(section)
                
                # Store the ordered structure in the context
                context['sections'] = ordered_sections
                
                # Log section, page, and question ordering for debugging
                logger.info('Ordered structure details:')
                for section in ordered_sections:
                    logger.info(f'Section: {section.uri}')
                    logger.info(f'  Title: {section.title_lang1}')
                    
                    for page in section.ordered_pages:
                        logger.info(f'  Page: {page.uri}')
                        logger.info(f'    Title: {page.title_lang1}')
                        
                        for question in page.ordered_questions:
                            logger.info(f'  Question: {question.attribute.uri if hasattr(question, "attribute") else "N/A"}')
                            logger.info(f'    Text: {question.text}')
                
                # Pre-fetch all values for this project for better performance
                values = Value.objects.filter(
                    project=project
                ).select_related('attribute', 'option').order_by('set_index', 'collection_index')
                
                # Store values in context for easy lookup
                values_dict = {}
                for value in values:
                    uri = value.attribute.uri
                    if uri not in values_dict:
                        values_dict[uri] = []
                    values_dict[uri].append(value)
                context['values'] = values_dict
                
                logger.info('DmpExportView: project id %s, found %d sections from catalog %s', 
                          project.id, sections.count(), project.catalog)
                
                # Log some sample values for debugging
                logger.info('Sample values for project:')
                for uri, value_list in list(context['values'].items())[:5]:
                    logger.info(f'URI: {uri}, Values: {[v.text for v in value_list]}')
            else:
                context['sections'] = []
                logger.warning('DmpExportView: project id %s has no catalog', project.id)
        else:
            context['sections'] = []
            logger.info('DmpExportView: No project found in context')
        
        return context

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
            # useful mock for local testing with the dmpt app:
            #   change to hardcoded return in create_support_issue_in_view()
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
            catalog = Catalog.objects.prefetch_elements().get(id=catalog_id)
            form_data = build_form_content(catalog.elements, obj)
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
        separator = "____"
        for form_field in form_data:
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

    def post(self, request, format=None):
        serializer = RdmoProjectValuesSerializer(data=request.data)
        if serializer.is_valid():
            catalog = Catalog.objects.get(id=serializer.data.get("catalog"))
            project = Project.objects.create(
                catalog=catalog, title=serializer.data.get("title"), site=get_current_site(self.request)
            )
            # add current user as owner
            membership = Membership(project=project, user=self.request.user, role='owner')
            membership.save()

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
            catalog = Catalog.objects.prefetch_elements().get(id=catalog_id)
        except Catalog.DoesNotExist as e:
            return Response(data=f"{e}", status=HTTP_400_BAD_REQUEST)
        sections = catalog.elements
        mandatory = get_mandatory_form_fields(sections)
        # FIXME: brute force,basically getting everything. Is there a way to reduce
        #   amount of data and database querying ?
        serializer = SectionSerializer(sections, many=True)
        data = {
            'sections': serializer.data,
            'mandatory_fields': mandatory,
        }
        return Response(data=data, status=HTTP_200_OK)


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
            catalog = Catalog.objects.prefetch_elements().get(id=catalog_id)
        except Catalog.DoesNotExist as e:
            return Response(data=f"{e}", status=HTTP_400_BAD_REQUEST)

        sections = catalog.elements
        if section_index >= len(sections):
            return Response(
                data=f"faulty index: {section_index}", status=HTTP_400_BAD_REQUEST
            )

        section = sections[section_index]
        data = get_section_data(section)

        return Response(data=data, status=HTTP_200_OK)

# -*- coding: utf-8 -*-

from django.db.models import Prefetch
from rdmo.questions.models import Catalog, QuestionSet
from rdmo.questions.serializers.v1 import QuestionSerializer


def get_catalog_with_sections(catalog_id):
    catalog = Catalog.objects.prefetch_related(
        "sections",
        Prefetch(
            "sections__questionsets",
            queryset=QuestionSet.objects.filter(
                questionset=None
            ).prefetch_related(
                "conditions",
                "questions",
                "questions__attribute",
                "questions__optionsets",
                "questionsets",
                "questions__optionsets__options",
            ),
        ),
    ).get(id=catalog_id)
    return catalog


def get_field_data(mandatory_fields, mandatory_question, section):
    if mandatory_question.widget_type in ['select', 'checkbox', 'radio']:
        mandatory_field_key = f'option-based_{mandatory_question.attribute.key}____{mandatory_question.id}'
    else:
        mandatory_field_key = f'{mandatory_question.attribute.key}____{mandatory_question.id}'
    serializer = QuestionSerializer(mandatory_question)
    data = serializer.data
    data['section_name'] = section.title
    return mandatory_field_key, data


def get_mandatory_form_fields(sections):
    mandatory_fields = {}
    # FIXME: DASS-2203: deactivated due to import errors with rdmo 2 vs 1 serializers
    for section in sections:
        for page in section.pages.all():
            for mandatory_question in page.questions.filter(is_optional=False):
                field_key, data = get_field_data(mandatory_fields, mandatory_question, section)
                mandatory_fields[field_key] = data
    return mandatory_fields


def get_radio_form_content(form_data, question, related_values):
    val = related_values.first()
    if val is not None:
        id = f'optionset-{val.option.optionsets.first().id}____{question.attribute.key}____{question.id}'
        form_data[id] = str(val.option.id)

        if val.text:
            form_data[f'additional-input-option-{val.option.id}-{id}'] = str(val.text)


def get_checkbox_form_content(form_data, question, related_values):
    for val in related_values.exclude(option=None):
        id = f'option-{val.option.id}____{question.attribute.key}____{question.id}'
        form_data[id] = str(val.option.id)

        if val.text:
            form_data[f'additional-input-{id}'] = str(val.text)


def get_select_form_content(form_data, question, related_values):
    for val in related_values.exclude(option=None):
        form_data[
            f'optionset-{val.option.optionsets.first().id}____{question.attribute.key}____{question.id}'] = str(
            val.option.id)


def get_autocomplete_form_content(form_data, question, related_values):
    for val in related_values.exclude(option=None):
        id = f'option-{val.option.id}____{question.attribute.key}____{question.id}'
        form_data[id] = str(val.option.id)


def get_form_content_from_values(dmpt_project, form_data, question):
    related_values = dmpt_project.rdmo_project.values.filter(attribute=question.attribute)
    if question.widget_type == 'select':
        get_select_form_content(form_data, question, related_values)
    elif question.widget_type == 'checkbox':
        get_checkbox_form_content(form_data, question, related_values)
    elif question.widget_type == 'radio':
        get_radio_form_content(form_data, question, related_values)
    elif question.widget_type == 'autocomplete':
        get_autocomplete_form_content(form_data, question, related_values)
    else:
        if len(related_values):
            form_data[f'{question.attribute.key}____{question.id}'] = related_values.first().text


def build_form_content(sections, dmpt_project):
    form_data = {}
    for section_index in range(0, len(sections)):
        for page in sections[section_index].elements:
            for question in page.elements:
                get_form_content_from_values(dmpt_project, form_data, question)
    return form_data

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


def get_mandatory_form_fields(sections):
    print('GET_MANDATORY_FORM_FIELDS')
    mandatory_fields = {}
    # FIXME: DASS-2203: deactivated due to import errors with rdmo 2 vs 1 serializers
    for section in sections:
        # question_sets = section.questionsets.all()
        for page in section.pages.all():
            for mandatory_question in page.questions.filter(is_optional=False):
                pass
        # for qs in question_sets:
        #     mandatory_questions = qs.questions.filter(is_optional=False)
        #     for mandatory_question in mandatory_questions:
        #         # print('\n\nrdmo_db_utils | get_mandatory_form_fields | complete mandatory_question ',)
        #
                if mandatory_question.widget_type == 'select' or \
                    mandatory_question.widget_type == 'checkbox' or \
                    mandatory_question.widget_type == 'radio':
                    mandatory_field_key = f'option-based_{mandatory_question.attribute.key}____{mandatory_question.id}'
                else:
                    mandatory_field_key = f'{mandatory_question.attribute.key}____{mandatory_question.id}'

                serializer = QuestionSerializer(mandatory_question)

                # json = JSONRenderer().render(serializer.data)
                # print(json)

                data = serializer.data
                data['section_name'] = section.title
                mandatory_fields[mandatory_field_key] = data
    return mandatory_fields


def build_form_content(sections, dmpt_project):
    form_data = {}
    for section_index in range(0, len(sections)):
        for question_set in sections[section_index].questionsets.all():
            for question in question_set.questions.all():
                related_values = dmpt_project.rdmo_project.values.filter(attribute=question.attribute)
                if len(related_values):
                    if question.widget_type == 'select':
                        for val in related_values.exclude(option=None):
                            form_data[f'optionset-{val.option.optionset.id}____{question.key}____{question.id}'] = str(
                                val.option.id)
                    elif question.widget_type == 'checkbox':
                        for val in related_values.exclude(option=None):
                            form_data[f'option-{val.option.id}____{question.key}____{question.id}'] = str(val.option.id)
                    elif question.widget_type == 'radio':
                        val = related_values.first()
                        form_data[f'optionset-{val.option.optionset.id}____{question.key}____{question.id}'] = str(
                            val.option.id)
                    else:
                        form_data[f'{question.key}____{question.id}'] = related_values.first().text
    return form_data

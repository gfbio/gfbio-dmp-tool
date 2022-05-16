# -*- coding: utf-8 -*-
from django.db.models import Prefetch
from rdmo.questions.models import Catalog, QuestionSet


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
                        form_data[f'optionset-{val.option.optionset.id}____{question.key}____{question.id}'] = str(val.option.id)
                    else:
                        # if question.widget_type in ['text', 'textarea']:
                        form_data[f'{question.key}____{question.id}'] = related_values.first().text
    return form_data

# -*- coding: utf-8 -*-

from rdmo.domain.serializers.v1 import AttributeSerializer
from rdmo.options.serializers.v1 import OptionSetSerializer, OptionSerializer
from rdmo.questions.serializers.v1 import PageSerializer, QuestionSerializer, SectionSerializer
from rdmo.questions.models import Question



def get_option_data(option_set, optionsets_list):
    optionset_data = OptionSetSerializer(option_set).data
    # options = option.options.all()
    options = option_set.elements
    optionset_data['options'] = OptionSerializer(options, many=True).data
    optionsets_list.append(optionset_data)


def get_question_data(question):
    question_data = QuestionSerializer(question).data
    question_data['attribute'] = AttributeSerializer(question.attribute).data
    question_data['question_conditions'] = []
    if question.conditions.all():
        for condition in question.conditions.all():
            related_question = Question.objects.get(attribute__id = condition.source.id)
            question_data['question_conditions'].append(
                {
                    'source_key': condition.source.key,
                    'source_id': related_question.id,
                    'target_option_id': condition.target_option_id,
                    'attribute_id': question.attribute_id,
                    'relation': condition.relation,
                    'target_text': condition.target_text
                }
            )
    optionsets_list = []
    optionsets = question.optionsets.all()
    for o in optionsets:
        get_option_data(o, optionsets_list)
    question_data['optionsets'] = optionsets_list
    return question_data


def get_questions_and_options(questions):
    question_list = []
    for q in questions:
        question_list.append(get_question_data(q))
    return question_list


def get_section_data(section):
    # FIXME: brute force,basically getting everything. Is there a way to reduce
    #   amount of data and database querying ?
    serializer = SectionSerializer(section)
    data = serializer.data
    data['pages'] = []
    data['conditions'] = []
    # Get pages in the correct order using section.elements
    pages = section.elements
    for page in pages:
        for c in page.conditions.all():
            data['conditions'].append(
                {
                    'source_key': c.source.key, 'target_option_id': c.target_option.id,
                    'elements': [{'element_key': e.attribute.key, 'page_id': page.id} for e in page.elements]
                }
            )
        page_data = PageSerializer(page).data
        # Use page.elements to get questions in the correct order
        page_data['pagequestions'] = get_questions_and_options(page.elements)
        data['pages'].append(page_data)
    return data

# -*- coding: utf-8 -*-
from rdmo.options.serializers.v1 import OptionSetSerializer, OptionSerializer
from rdmo.questions.serializers.v1 import PageSerializer, QuestionSerializer, SectionSerializer


def get_questions_and_options(questions):
    question_list = []
    for q in questions:
        question_data = QuestionSerializer(q).data
        optionsets_list = []
        optionsets = q.optionsets.all()
        if len(optionsets):
            for o in optionsets:
                optionset_data = OptionSetSerializer(o).data
                options = o.options.all()
                optionset_data['options'] = OptionSerializer(options, many=True).data
                optionsets_list.append(optionset_data)
            question_data['optionsets'] = optionsets_list
        question_list.append(question_data)
    return question_list


def get_section_data(section):
    # FIXME: brute force,basically getting everything ..
    serializer = SectionSerializer(section)
    data = serializer.data
    data['pages'] = []
    for page in section.pages.all():
        page_data = PageSerializer(page).data
        question_list = get_questions_and_options(page.questions.all())
        page_data['pagequestions'] = question_list
        data['pages'].append(page_data)
    return data

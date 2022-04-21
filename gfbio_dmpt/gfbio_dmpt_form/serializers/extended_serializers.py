# -*- coding: utf-8 -*-
from rdmo.conditions.serializers.v1 import ConditionSerializer
from rdmo.options.serializers.v1 import OptionSetNestedSerializer
from rdmo.questions.models import Question
from rdmo.questions.serializers.v1 import QuestionNestedSerializer, QuestionSetNestedSerializer, \
    SectionNestedSerializer


class DmptQuestionNestedSerializer(QuestionNestedSerializer):
    optionsets = OptionSetNestedSerializer(read_only=True, many=True)

    class Meta:
        model = Question
        fields = (
            'id',
            'key',
            'uri',
            'uri_prefix',
            'path',
            'locked',
            'order',
            'text',
            'help',
            'attribute',
            'conditions',
            'optionsets',
            'is_collection',
            'is_optional',
            'unit',
            'widget_type',
            'warning',
            'xml_url'
        )


class DmptQuestionSetNestedSerializer(QuestionSetNestedSerializer):
    questions = DmptQuestionNestedSerializer(many=True, read_only=True)
    conditions = ConditionSerializer(many=True, read_only=True)


class DmptSectionNestedSerializer(SectionNestedSerializer):
    questionsets = DmptQuestionSetNestedSerializer(many=True)

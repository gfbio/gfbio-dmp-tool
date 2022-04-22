# -*- coding: utf-8 -*-
from rdmo.conditions.serializers.v1 import ConditionSerializer
from rdmo.options.models import Option
from rdmo.options.serializers.v1 import OptionSetNestedSerializer, OptionNestedSerializer
from rdmo.questions.models import Question, Section
from rdmo.questions.serializers.v1 import QuestionNestedSerializer, QuestionSetNestedSerializer, \
    SectionNestedSerializer
from rest_framework import serializers


class DmptOptionNestedSerializer(OptionNestedSerializer):
    class Meta:
        model = Option
        fields = (
            'id',
            'key',
            'uri',
            'uri_prefix',
            'path',
            'locked',
            'order',
            'text',
            'warning',
            'xml_url'
        )


class DmptOptionSetNestedSerializer(OptionSetNestedSerializer):
    options = DmptOptionNestedSerializer(many=True)


class DmptQuestionNestedSerializer(QuestionNestedSerializer):
    optionsets = DmptOptionSetNestedSerializer(read_only=True, many=True)

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


class DmptSectionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Section
        fields = (
            'id',
            'uri',
            'uri_prefix',
            'key',
            'path',
            'locked',
            'order',
            'title',
        )

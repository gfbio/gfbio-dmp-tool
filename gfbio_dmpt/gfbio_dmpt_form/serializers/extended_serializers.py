# # -*- coding: utf-8 -*-
from rdmo.conditions.serializers.v1 import ConditionSerializer
from rdmo.options.models import Option
from rdmo.options.serializers.v1 import (
    OptionSetNestedSerializer,
    OptionSerializer
    # OptionNestedSerializer,
)
from rdmo.questions.models import Question, QuestionSet, Section
from rdmo.questions.serializers.v1 import (
    # QuestionNestedSerializer,
    QuestionSerializer,
    QuestionSetNestedSerializer,
    SectionNestedSerializer,
)
from rest_framework import serializers


# class DmptOptionNestedSerializer(OptionNestedSerializer):
# TODO: currently the only advantage is to reduce the no of fields
#   using OptionSerializer directly may be much easier
class DmptOptionNestedSerializer(OptionSerializer):
    class Meta:
        model = Option
        fields = (
            "id",
            # "key",
            "comment",
            "uri",
            "uri_prefix",
            # "path",
            "locked",
            # "order",
            "text",
            "warning",
            # "xml_url",
        )
        trans_fields = (
            'text',
            'help',
            'view_text'
        )
        parent_fields = (
            ('optionsets', 'optionset', 'option', 'optionset_options'),
        )
        # validators = (
        #     OptionUniqueURIValidator(),
        #     OptionLockedValidator()
        # )
        warning_fields = (
            'text',
        )


class DmptOptionSetNestedSerializer(OptionSetNestedSerializer):
    options = DmptOptionNestedSerializer(many=True)


# class DmptQuestionNestedSerializer(QuestionNestedSerializer):
class DmptQuestionNestedSerializer(QuestionSerializer):
    optionsets = DmptOptionSetNestedSerializer(read_only=True, many=True)

    class Meta:
        model = Question
        fields = (
            "id",
            # "key",
            "uri",
            "uri_prefix",
            # "path",
            "locked",
            # "order",
            "text",
            "help",
            "attribute",
            "conditions",
            "optionsets",
            "is_collection",
            "is_optional",
            "unit",
            "widget_type",
            "value_type",
            "warning",
            # "xml_url",
        )
        trans_fields = (
            'text',
            'help',
            'default_text',
            'verbose_name'
        )
        parent_fields = (
            ('pages', 'page', 'question', 'page_questions'),
            ('questionsets', 'questionset', 'question', 'questionset_questions')
        )
        # validators = (
        #     QuestionUniqueURIValidator(),
        #     QuestionLockedValidator()
        # )
        warning_fields = (
            'text',
        )


# TODO: currently the only advantage is to reduce the no of fields
#   using OptionSerializer directly may be much easier
class DmptQuestionSetNestedSerializer(QuestionSetNestedSerializer):
    questions = DmptQuestionNestedSerializer(many=True, read_only=True)
    conditions = ConditionSerializer(many=True, read_only=True)

    class Meta:
        model = QuestionSet
        fields = (
            "comment",
            "id",
            "help",
            "uri",
            "uri_prefix",
            # "path",
            "locked",
            # "order",
            "title",
            "attribute",
            "conditions",
            "is_collection",
            # "section",
            # "questionset",
            "questionsets",
            "questions",
            "warning",
            # "xml_url",
        )
        trans_fields = (
            'title',
            'help',
            'verbose_name'
        )
        parent_fields = (
            ('pages', 'page', 'questionset', 'page_questionsets'),
            ('parents', 'parent', 'questionset', 'questionset_questionsets')
        )
        through_fields = (
            ('questionsets', 'parent', 'questionset', 'questionset_questionsets'),
            ('questions', 'questionset', 'question', 'questionset_questions')
        )
        # validators = (
        #     QuestionSetUniqueURIValidator(),
        #     QuestionSetQuestionSetValidator(),
        #     QuestionSetLockedValidator()
        # )
        warning_fields = (
            'title',
        )


class DmptSectionNestedSerializer(SectionNestedSerializer):
    questionsets = DmptQuestionSetNestedSerializer(many=True)


# TODO: remove, this is very basic and demands to keep track of rdmo development
#   the only case to keep this would be, that a VERY simple json serialization
#   is sufficient, with the bonus to reduce repsonse data, depending on what app needs
#   the original rdmo serializer has the benefit of containing their translation approach
#   for e.g. title, titl_de or title_lnag_1 or whatever they are doing there.
class DmptSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = (
            "id",
            "uri",
            "uri_prefix",
            # "key",
            # "path",
            "locked",
            # "order",
            "title",
        )

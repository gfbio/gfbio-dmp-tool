# -*- coding: utf-8 -*-
from rdmo.questions.serializers.v1 import QuestionNestedSerializer, QuestionSetNestedSerializer, SectionNestedSerializer


class DmptQuestionNestedSerializer(QuestionNestedSerializer):
    pass


class DmptQuestionSetNestedSerializer(QuestionSetNestedSerializer):
    questions = DmptQuestionNestedSerializer(many=True, read_only=True)


class DmptSectionNestedSerializer(SectionNestedSerializer):
    questionsets = DmptQuestionSetNestedSerializer(many=True)

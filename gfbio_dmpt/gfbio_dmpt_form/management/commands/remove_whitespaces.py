# -*- coding: utf-8 -*-

from django.core.management.base import BaseCommand
from rdmo.options.models import OptionSet, Option
from rdmo.questions.models import Catalog, Section, QuestionSet, Question


class Command(BaseCommand):
    help = 'Removes whitespaces from the "key" field of  RDMO Catalogs, Sections, OptionSets, Options, ' \
           'QuestionSets and Questions'

    def handle(self, *args, **kwargs):
        catalogs = Catalog.objects.filter(key__contains=' ')
        for c in catalogs:
            c.key = c.key.replace(' ', '_')
        Catalog.objects.bulk_update(catalogs, ['key'])

        sections = Section.objects.filter(key__contains=' ')
        for s in sections:
            s.key = s.key.replace(' ', '_')
        Section.objects.bulk_update(sections, ['key'])

        option_sets = OptionSet.objects.filter(key__contains=' ')
        for o in option_sets:
            o.key = o.key.replace(' ', '_')
        OptionSet.objects.bulk_update(option_sets, ['key'])

        options = Option.objects.filter(key__contains=' ')
        for o in options:
            o.key = o.key.replace(' ', '_')
        Option.objects.bulk_update(options, ['key'])

        question_sets = QuestionSet.objects.filter(key__contains=' ')
        for q in question_sets:
            q.key = q.key.replace(' ', '_')
        QuestionSet.objects.bulk_update(question_sets, ['key'])

        questions = Question.objects.filter(key__contains=' ')
        for q in questions:
            q.key = q.key.replace(' ', '_')
        Question.objects.bulk_update(questions, ['key'])

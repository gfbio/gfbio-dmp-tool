# -*- coding: utf-8 -*-
from django.core.management import CommandError
from django.core.management.base import BaseCommand
from rdmo.questions.models import Catalog, Question, Section, QuestionSet


class Command(BaseCommand):
    help = '(re) generates paths and URIS for RDMO Catalogs, Sections, OptionSets, Options, ' \
           'QuestionSets and Questions'

    def add_arguments(self, parser):
        parser.add_argument('catalog_id', type=int)

    def handle(self, *args, **kwargs):
        catalog = Catalog.objects.filter(id=kwargs['catalog_id'])
        if len(catalog) == 1:
            sections = Section.objects.filter(catalog=kwargs['catalog_id'])
            for element in sections:
                # save() executes build_path & build_uri before super().save()
                element.save()

            question_sets = QuestionSet.objects.filter(section__catalog=kwargs['catalog_id'])
            for element in question_sets:
                # save() executes build_path & build_uri before super().save()
                element.save()

            questions = Question.objects.filter(questionset__section__catalog=kwargs['catalog_id'])
            for element in questions:
                # save() executes build_path & build_uri before super().save()
                element.save()
                for os in element.optionsets.all():
                    # save() executes build_path & build_uri before super().save()
                    os.save()
                    for o in os.options.all():
                        # save() executes build_path & build_uri before super().save()
                        o.save()
        else:
            raise CommandError('no catalog could be found for "catalog_id" ', kwargs['catalog_id'])

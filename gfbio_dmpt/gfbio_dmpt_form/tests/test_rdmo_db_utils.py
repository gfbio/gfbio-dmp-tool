# -*- coding: utf-8 -*-
import json
from inspect import Attribute
from pprint import pprint

from django.test import TestCase
from rdmo.domain.models import Attribute
from rdmo.projects.models import Project, Value
from rdmo.questions.models import Catalog
from rdmo.questions.serializers.v1 import SectionSerializer, PageSerializer, QuestionSerializer
from rdmo.questions.serializers.v1.page import PageQuestionSerializer
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

from gfbio_dmpt.gfbio_dmpt_form.models import DmptProject
from gfbio_dmpt.gfbio_dmpt_form.rdmo_db_utils import get_catalog_with_sections
from gfbio_dmpt.gfbio_dmpt_form.serializers.extended_serializers import DmptSectionNestedSerializer, \
    DmptSectionSerializer
from gfbio_dmpt.users.models import User


class TestRdmoDbUtils(TestCase):
    fixtures = ["dumps/local_dump_with_2.2.2.json"]

    # @staticmethod
    # def _prepareData():
    #     c = Catalog.objects.get(id=18)
    #     p = Project.objects.create(title="Test Data", catalog=c)
    #     a = Attribute.objects.get(id=241)
    #     v = Value.objects.create(
    #         project=p, attribute=a, text="Test Project Title Value", value_type="text"
    #     )

    # @classmethod
    # def setUpTestData(cls):
    #     # cls.std_user = User.objects.create_user(
    #     #     username="john",
    #     #     email="john@doe.de",
    #     #     password="secret",
    #     #     is_staff=False,
    #     #     is_superuser=False,
    #     # )
    #     # token = Token.objects.create(user=cls.std_user)
    #     # client = APIClient()
    #     # client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
    #     # cls.std_client = client
    #     pass
    #     # cls._prepareData()

    def test_get_catalog_with_sections(self):
        # works, query as usual
        #catalog = Catalog.objects.get(id=18)

        # broken due to rdmo 2
        # catalog = get_catalog_with_sections(catalog_id=18)/

        # TODO: taken from rdmo, after hint in meeting
        catalog = Catalog.objects.prefetch_elements().get(id=18)

        # pprint(catalog.__dict__)
        print('SECTIONS:')
        pprint(catalog.sections.all())
        first_section = catalog.sections.all().first()
        # pprint(first_section.__dict__)
        print('-----------------------------------------\n')


        # TODO: works: see benefits in comment below
        # serializer = SectionSerializer(catalog.sections.all(), many=True)
        # pprint(serializer.data, indent=4)

        # TODO: works: replacement for current custom serializer, or override if VERY simple case
        #   e.g just section.title or similar needed to reduece response complexity
        #   so far I seems the app currently tries to access section.title and section.quuestionset
        # serializer = SectionSerializer(first_section)
        # pprint(serializer.data)

        # TODO: works
        # page_serializer = PageSerializer(first_section.pages.all(), many=True)
        # print(page_serializer.data)

        print(first_section)
        # TODO: section is on page in our app, in the past questionsets where directly connected to the section,
        #   in the qset were the questions. NOW the page model is in between, which can contain qsets, but in case
        #   of the imported dump the page has no qsets, but the related questions are accessible via the page, conditions and
        #   options as well
        for p in first_section.pages.all():
            print('\n---------', p , '----------------')

            # TODO: works
            # page_serializer = PageSerializer(p)
            # print(page_serializer.data)

            question_serializer = QuestionSerializer(p.questions.all(), many=True)
            pprint(question_serializer.data)

            # TODO: below works -----------------------------
            # in gfbio catalog import, all p.questionsets are empty currently
            # print('questionsets ', p.questionsets.all())
            # questions =p.questions.all()
            # print('questions ', questions)
            # for question in questions:
            #     print('\n\tquestion ', type(question), question)
            #     print('\twtype: ', question.widget_type)
            #     print('\ttext:', question.text)
            #     print('\thelp:', question.help)
            #     print('\tconds.:', question.conditions.all())
            #     print('\toptionssets:', question.optionsets.all())
            # ---------------------------------------------------


        # TODO: works: but constraint to field list. see above for alternative
        # serializer =  DmptSectionSerializer(first_section)
        # pprint(serializer.data)


        # -------------------------------------------------
        # with open('dumps/rdmo_testinstance_dump_for_2.2.2.json', 'r') as f:
        #     data = json.load(f)
        #     for d in data:
        #         if d["model"] == "options.optionset" or d["model"] == "options.option" or \
        #             d["model"] == "conditions.condition" or d["model"] == "questions.catalog" \
        #             or d["model"] == "questions.section" or d["model"] == "questions.questionset":
        #             key = d.get('fields', {}).pop("key", None)
        #             path = d.get('fields', {}).pop("path", None)
        #             optionset = d.get('fields', {}).pop("optionset", None)
        #             order = d.get('fields', {}).pop("order", None)
        #             catalog = d.get('fields', {}).pop("catalog", None)
        #             section = d.get('fields', {}).pop("section", None)
        #     with open('dumps/data.json', 'w') as f_out:
        #         json.dump(data, f_out)

# -*- coding: utf-8 -*-
import json
from inspect import Attribute

from django.test import TestCase
from rdmo.domain.models import Attribute
from rdmo.projects.models import Project, Value
from rdmo.questions.models import Catalog
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

from gfbio_dmpt.users.models import User


class TestDmptFormDataView(TestCase):
    fixtures = ['dumps/rdmo_testinstance_dump.json']

    @staticmethod
    def _prepareData():
        c = Catalog.objects.get(id=18)
        p = Project.objects.create(title="Test Data", catalog=c)
        a = Attribute.objects.get(id=241)
        v = Value.objects.create(project=p, attribute=a, text='Test Project Title Value', value_type='text')

    @classmethod
    def setUpTestData(cls):
        cls.std_user = User.objects.create_user(
            username="john",
            email="john@doe.de",
            password="secret",
            is_staff=False,
            is_superuser=False,
        )
        token = Token.objects.create(user=cls.std_user)
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        cls.std_client = client
        cls._prepareData()

    def test_get(self):
        catalog_id = 18
        section_index = 0
        response = self.std_client.get(f'/dmp/section/{catalog_id}/{section_index}/')
        self.assertEqual(200, response.status_code)

    def test_get_content(self):
        catalog_id = 18  # ???
        section_index = 0
        # TODO: single section or all sections for app ?
        #  or a get section view e.g. [{title: '', sectionId: 23}, ...]
        response = self.std_client.get(f'/dmp/section/{catalog_id}/{section_index}/')
        content = json.loads(response.content)
        self.assertIn('questionsets', content.keys())
        self.assertIn('questions', content.get('questionsets', []).pop().keys())

    def test_get_section_list(self):
        catalog_id = 18  # ???
        response = self.std_client.get(f'/dmp/sections/{catalog_id}/')
        self.assertEqual(200, response.status_code)
        self.assertIsInstance(json.loads(response.content), list)

    def test_post_rdmo_project(self):
        catalog_id = 18  # ???
        catalog = Catalog.objects.get(id=catalog_id)
        title = 'rmdo test project (unit-test)'
        data = {
            'title': title,
            'catalog': catalog.id,
        }
        response = self.std_client.post('/dmp/projects/', data)
        self.assertEqual(201, response.status_code)
        self.assertEqual(1, len(Project.objects.filter(title=title)))

    def test_post_value(self):
        # <textarea class="form-control" id="question-525" name="data_backup" rows="3"></textarea>
        # project = Project.objects.first()
        catalog_id = 18  # ???
        catalog = Catalog.objects.get(id=catalog_id)
        data = {
            'catalog': catalog.id,
            'title': 'Le Title',
            'form_data': {
                'project_name': 'Project name from question',
                'data_backup': 'Data Backup bla bla bla ...',
            }
        }
        response = self.std_client.post('/dmp/projects/values/', data, format='json')
        print(response.status_code)
        print(response.content)

        values = Value.objects.all()
        for v in values:
            print('\n\n', v.__dict__)

        # data = {
        #     'catalog': 666,
        #     'title': 'Le Wrong',
        #     'form_data': {
        #         'data_backup': 'Data Backup bla bla bla ...',
        #     }
        # }
        # response = self.std_client.post('/dmp/projects/values/', data, format='json')
        # print(response.status_code)
        # print(response.content)

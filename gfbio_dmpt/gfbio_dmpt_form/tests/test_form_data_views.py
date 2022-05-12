# -*- coding: utf-8 -*-
import json
from inspect import Attribute

from django.test import TestCase
from rdmo.domain.models import Attribute
from rdmo.projects.models import Project, Value
from rdmo.questions.models import Catalog
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

from gfbio_dmpt.gfbio_dmpt_form.models import DmptProject
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
        # {
        #     "project_name": "Project Title",
        #     "optionset-54____categoryType": "317",
        #     "option-247____is_data_reproducible": "247",
        #     "option-248____is_data_reproducible": "248",
        #     "PersonName": "Contact for data",
        #     "option-325____principal_investigators": "325"
        # }
        # project = Project.objects.first()
        catalog_id = 18  # ???
        catalog = Catalog.objects.get(id=catalog_id)
        data = {
            'catalog': catalog.id,
            'title': 'Le Title',
            'form_data': {
                'project_name': 'Project Title',
                'optionset-54____categoryType': '317',
                'option-247____is_data_reproducible': '247',
                'option-248____is_data_reproducible': '248',
                'PersonName': 'Contact for data',
                'option-325____principal_investigators': '325'
            }
        }
        response = self.std_client.post('/dmp/projects/values/', data, format='json')
        self.assertEqual(201, response.status_code)
        content = json.loads(response.content)
        self.assertDictEqual(content['form_data'], data['form_data'])

        projects = Project.objects.filter(title=data['title'])
        self.assertEqual(1, len(projects))
        self.assertEqual(projects.first().id, content.get('rdmo_project_id', -1))

        values = Value.objects.filter(project=projects.first())
        self.assertEqual(6, len(values))
        self.assertEqual(4, len(Value.objects.filter(project=projects.first()).filter(option_id__isnull=False)))


class TestDmptProjectDetailView(TestCase):
    fixtures = ['dumps/rdmo_testinstance_dump.json']

    @classmethod
    def setUpTestData(cls):
        cls.user_1 = User.objects.create_user(
            username="john",
            email="john@doe.de",
            password="secret",
            is_staff=False,
            is_superuser=False,
        )
        token = Token.objects.create(user=cls.user_1)
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        cls.client_1 = client

        rdmo_project = Project.objects.create(title="Unit Test 1")
        DmptProject.objects.create(user=cls.user_1, rdmo_project=rdmo_project)
        rdmo_project = Project.objects.create(title="Unit Test 2")
        DmptProject.objects.create(user=cls.user_1, rdmo_project=rdmo_project)

        cls.user_2 = User.objects.create_user(
            username="joe",
            email="joe@doe.de",
            password="f00",
            is_staff=False,
            is_superuser=False,
        )
        token = Token.objects.create(user=cls.user_2)
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        cls.client_2 = client

    def _post_values(self):
        catalog_id = 18
        catalog = Catalog.objects.get(id=catalog_id)
        data = {
            'catalog': catalog.id,
            'title': 'Le Title',
            'form_data': {
                'project_name': 'Project Title',
                'optionset-54____categoryType': '317',
                'option-247____is_data_reproducible': '247',
                'option-248____is_data_reproducible': '248',
                'PersonName': 'Contact for data',
                'option-325____principal_investigators': '325'
            }
        }
        self.client_1.post('/dmp/projects/values/', data, format='json')

    def test_db_content(self):
        self.assertEqual(2, len(Project.objects.all()))
        self.assertEqual(2, len(DmptProject.objects.all()))

    def test_unauthorized_get(self):
        response = self.client.get("/dmp/dmptprojects/1/")
        self.assertEqual(401, response.status_code)

    def test_invalid_token_get(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION="Token 1234xxx1234")
        response = client.get("/dmp/dmptprojects/1/")
        self.assertEqual(401, response.status_code)

    def test_invalid_password_get(self):
        client = APIClient()
        client.login(username="john", password="invalid")
        response = client.get("/dmp/dmptprojects/1/")
        self.assertEqual(401, response.status_code)

    def test_valid_get(self):
        dp = DmptProject.objects.first()
        response = self.client_1.get("/dmp/dmptprojects/{}/".format(dp.pk))
        self.assertEqual(200, response.status_code)
        content = json.loads(response.content)
        self.assertIn("rdmo_project", content.keys())

    def test_not_owner_get(self):
        dp = DmptProject.objects.first()
        response = self.client_2.get("/dmp/dmptprojects/{}/".format(dp.pk))
        self.assertEqual(403, response.status_code)

    def test_form_data_content(self):
        self._post_values()
        rdmo_project = Project.objects.get(title='Le Title')
        dmpt_project = DmptProject.objects.create(user=self.user_1, rdmo_project=rdmo_project)
        response = self.client_1.get("/dmp/dmptprojects/{}/".format(dmpt_project.pk))
        content = json.loads(response.content)
        self.assertEqual(200, response.status_code)
        self.assertDictEqual({
            'project_name': 'Project Title',
            'optionset-54____categoryType': '317',
            'option-247____is_data_reproducible': '247',
            'option-248____is_data_reproducible': '248',
            'PersonName': 'Contact for data',
            'option-325____principal_investigators': '325'
        }, content.get('form_data', {}))

    def test_no_values(self):
        dp = DmptProject.objects.first()
        response = self.client_1.get("/dmp/dmptprojects/{}/".format(dp.pk))
        self.assertEqual(200, response.status_code)
        content = json.loads(response.content)
        self.assertDictEqual({}, content.get('form_data', {'foo': 'bar'}))

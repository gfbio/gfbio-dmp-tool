# -*- coding: utf-8 -*-
import json
from pprint import pp
from unittest.mock import patch, Mock

from django.contrib.auth.models import Group
from django.test import TestCase
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

from gfbio_dmpt.users.models import User

from rdmo.questions.models.catalog import Catalog
from rdmo.projects.models.project import Project
import pytest

from gfbio_dmpt.gfbio_dmpt_form.views import DmpRequestHelp

class RdmoRequestTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        user = User.objects.create_user(
            username="kevin", email="kevin@kevin.de", password="secret", is_staff=True
        )
        token = Token.objects.create(user=user)
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        cls.staff_client = client

    def test_get_catalog(self):
        response = self.staff_client.get("/api/v1/projects/projects/")
        print(response.status_code)
        content = json.loads(response.content)
        pp(content)


class RdmoLocalServerRequestTest(TestCase):

    # @classmethod
    # def setUpTestData(cls):
    #     user = User.objects.create_user(
    #         username='kevin', email='kevin@kevin.de', password='secret',
    #         is_staff=True)
    #     token = Token.objects.create(user=user)
    #     client = APIClient()
    #     client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
    #     cls.staff_client = client

    def test_get_project(self):
        # http://0.0.0.0:8000/api/v1/

        # http://0.0.0.0:8000/api/v1/projects/projects/
        # http://0.0.0.0:8000/api/v1/projects/projects/95/

        # FIXME: User has to be in api group for widget to work

        # http://0.0.0.0:8000/api/v1/projects/projects/131/values/

        # [
        #   {
        #     "id": 79,
        #     "created": "2021-11-10T13:35:26.951085Z",
        #     "updated": "2021-11-10T13:35:26.951092Z",
        #     "attribute": 252,
        #     "set_prefix": "",
        #     "set_index": 0,
        #     "collection_index": 0,
        #     "text": "Other",
        #     "option": null,
        #     "file_name": null,
        #     "file_url": null,
        #     "value_type": "option",
        #     "unit": "",
        #     "external_id": ""
        #   },
        #   {
        #     "id": 75,
        #     "created": "2021-11-10T13:35:25.949021Z",
        #     "updated": "2021-11-10T13:35:25.949028Z",
        #     "attribute": 241,
        #     "set_prefix": "",
        #     "set_index": 0,
        #     "collection_index": 0,
        #     "text": "MW user project via app",
        #     "option": null,
        #     "file_name": null,
        #     "file_url": null,
        #     "value_type": "text",
        #     "unit": "",
        #     "external_id": ""
        #   },
        #   {
        #     "id": 78,
        #     "created": "2021-11-10T13:35:26.715218Z",
        #     "updated": "2021-11-10T13:35:26.715225Z",
        #     "attribute": 245,
        #     "set_prefix": "",
        #     "set_index": 0,
        #     "collection_index": 0,
        #     "text": "Other",
        #     "option": null,
        #     "file_name": null,
        #     "file_url": null,
        #     "value_type": "option",
        #     "unit": "",
        #     "external_id": ""
        #   },
        #   {
        #     "id": 76,
        #     "created": "2021-11-10T13:35:26.199680Z",
        #     "updated": "2021-11-10T13:35:26.199687Z",
        #     "attribute": 242,
        #     "set_prefix": "",
        #     "set_index": 0,
        #     "collection_index": 0,
        #     "text": "Other",
        #     "option": null,
        #     "file_name": null,
        #     "file_url": null,
        #     "value_type": "option",
        #     "unit": "",
        #     "external_id": ""
        #   },
        #   {
        #     "id": 77,
        #     "created": "2021-11-10T13:35:26.478203Z",
        #     "updated": "2021-11-10T13:35:26.478211Z",
        #     "attribute": 244,
        #     "set_prefix": "",
        #     "set_index": 0,
        #     "collection_index": 0,
        #     "text": "React app injected ....",
        #     "option": null,
        #     "file_name": null,
        #     "file_url": null,
        #     "value_type": "text",
        #     "unit": "",
        #     "external_id": ""
        #   }
        # ]

        pass


class TestDmptFrontendView(TestCase):
    @classmethod
    def setUpTestData(cls):
        Group.objects.create(name="api")
        cls.std_user = User.objects.create_user(
            username="john",
            email="john@doe.de",
            password="secret",
            is_staff=False,
            is_superuser=False,
        )

    def test_get_not_logged_in(self):
        response = self.client.get("/dmpt/app/")
        self.assertEqual(200, response.status_code)
        self.assertIn(b"{'isLoggedIn': 'false', 'token':", response.content)

    def test_get_logged_in(self):
        self.client.login(username="john", password="secret")
        response = self.client.get("/dmpt/app/")
        self.assertEqual(200, response.status_code)
        self.assertIn(b"{'isLoggedIn': 'true', 'token':", response.content)


class TestDmpExportView(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.std_user = User.objects.create_user(
            username="john",
            email="john@doe.de",
            password="secret",
            is_staff=False,
            # TODO:  <08-12-21, > # this ia a quick and dirty way that we can
            # access all dmps in the download test. Actually it would be more
            # sensible to associate a dmp to the user and download as this user
            # as well. This should become an extension testing from different
            # user perspectives
            # * admin/normal user
            # * logged in non logged in etc
            is_superuser=True,
        )

    def test_get_dmp_pdf_logged_in(self):
        self.client.login(username="john", password="secret")
        catalog, status = Catalog.objects.get_or_create(key="testkey")
        project, status = Project.objects.get_or_create(title="Test", catalog=catalog)
        response = self.client.get(f"/dmpt/export/{project.pk}/pdf", follow=True)
        self.assertEquals(response.get("Content-Type"), "application/pdf")

class TestDmpRequestHelp(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.std_user = User.objects.create_user(
            username="john",
            email="john@doe.de",
            password="secret",
            is_staff=False,
            is_superuser=True,
        )

    @patch("gfbio_dmpt.gfbio_dmpt_form.views.JIRA")
    @patch("gfbio_dmpt.gfbio_dmpt_form.views.Ticket")
    def test_get_dmp_help_logged_in(self, mock_JIRA, mock_Ticket):
        # TODO:  <15-12-21, claas> # Better would be to mock the jira ticket in a way
        # that it can be saved properly in the database.
        mock_JIRA.search_users.return_value = True
        mock_JIRA.create_issue.return_value = True
        mock_Ticket.objcects.create.return_value = True
        self.client.login(username="john", password="secret")
        catalog, status = Catalog.objects.get_or_create(key="testkey")
        project, status = Project.objects.get_or_create(title="Test", catalog=catalog)
        response = self.client.get(f"/dmpt/help/{project.pk}", follow=True)
        self.assertEqual(200, response.status_code)

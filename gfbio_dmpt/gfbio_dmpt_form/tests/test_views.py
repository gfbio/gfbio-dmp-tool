# -*- coding: utf-8 -*-
import json
from unittest.mock import patch

from django.contrib.auth.models import Group
from django.test import TestCase
from rdmo.projects.models.project import Project
from rdmo.questions.models.catalog import Catalog
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

from gfbio_dmpt.users.models import User


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
        project, status = Project.objects.get_or_create(title="Test",
                                                        catalog=catalog)
        response = self.client.get(f"/dmpt/export/{project.pk}/pdf",
                                   follow=True)
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
        project, status = Project.objects.get_or_create(title="Test",
                                                        catalog=catalog)
        response = self.client.get(f"/dmpt/help/{project.pk}", follow=True)
        self.assertEqual(200, response.status_code)


class TestDmptProjectViews(TestCase):

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

    def test_unauthorized_post(self):
        response = self.client.post('/dmp/dmptprojects/', {})
        self.assertEqual(401, response.status_code)

    def test_user_post(self):
        dp = Project.objects.create(title='Unit Test')
        response = self.std_client.post('/dmp/dmptprojects/', {
            'rdmo_project': dp.id,
            'user': self.std_user.id,
        })
        self.assertEqual(201, response.status_code)
        content = json.loads(response.content)
        self.assertIn('rdmo_project', content.keys())
        self.assertEqual(dp.id, content.get('rdmo_project', 'invalid_id'))

    # def test_user_post_no_uid(self):
    #     dp = Project.objects.create(title='Unit Test')
    #     response = self.std_client.post('/dmp/dmptprojects/', {
    #         'rdmo_project': dp.id,
    #         # 'user': self.std_user.id,
    #     })
    #     self.assertEqual(201, response.status_code)
    #     content = json.loads(response.content)
    #     print(content)
    #     self.assertIn('rdmo_project', content.keys())
    #     self.assertEqual(dp.id, content.get('rdmo_project', 'invalid_id'))

    def test_unauthorized_get(self):
        response = self.client.get('/dmp/dmptprojects/')
        self.assertEqual(401, response.status_code)

    def test_user_get(self):
        response = self.std_client.get('/dmp/dmptprojects/')
        self.assertEqual(200, response.status_code)
        self.assertEqual([], json.loads(response.content))

    def test_user_get_content(self):
        dp = Project.objects.create(title='Unit Test')
        self.std_client.post('/dmp/dmptprojects/', {
            'rdmo_project': dp.id,
            'user': self.std_user.id,
        })
        response = self.std_client.get('/dmp/dmptprojects/')
        self.assertEqual(200, response.status_code)
        content = json.loads(response.content)
        self.assertIsInstance(content, list)
        self.assertEqual(1, len(content))

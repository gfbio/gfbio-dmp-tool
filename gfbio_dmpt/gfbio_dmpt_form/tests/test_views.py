# -*- coding: utf-8 -*-
import json
from unittest.mock import patch

from django.contrib.auth.models import Group
from django.test import TestCase
from rdmo.projects.models.project import Project
from rdmo.questions.models.catalog import Catalog
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

from gfbio_dmpt.gfbio_dmpt_form.models import DmptProject
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
        response = self.client.get("/dmp/create/")
        self.assertEqual(200, response.status_code)
        self.assertIn(b"{'isLoggedIn': 'false', 'token':", response.content)

    def test_get_logged_in(self):
        self.client.login(username="john", password="secret")
        response = self.client.get("/dmp/create/")
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
            # is_superuser=True,
        )

    def test_get_dmp_pdf_logged_in(self):
        self.client.login(username="john", password="secret")
        catalog = Catalog.objects.create(key="testkey")
        project = Project.objects.create(title="Test",
                                         catalog=catalog)
        print(catalog)
        print(project.site)
        response = self.client.get(f"/dmp/export/{project.pk}/pdf/")
        self.assertEqual(200, response.status_code)
        self.assertEquals(response.get("Content-Type"), "application/pdf")

    def test_get_dmp_pdf_not_logged_in(self):
        catalog, status = Catalog.objects.get_or_create(key="testkey")
        project, status = Project.objects.get_or_create(title="Test",
                                                        catalog=catalog)
        response = self.client.get(f"/dmp/export/{project.pk}/pdf",
                                   follow=True)
        self.assertEqual(200, response.status_code)
        self.assertNotEquals(response.get("Content-Type"), "application/pdf")


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
        response = self.client.get(f"/dmp/help/{project.pk}", follow=True)
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

        cls.std_user_2 = User.objects.create_user(
            username="jane",
            email="jane@doe.de",
            password="top-secret",
            is_staff=False,
            is_superuser=False,
        )
        token = Token.objects.create(user=cls.std_user_2)
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        cls.std_client_2 = client

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

    def test_unauthorized_get(self):
        response = self.client.get('/dmp/dmptprojects/')
        self.assertEqual(401, response.status_code)

    def test_user_get_empty(self):
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

    def test_get_content_structure(self):
        dp = Project.objects.create(title='Unit Test')
        self.std_client.post('/dmp/dmptprojects/', {
            'rdmo_project': dp.id,
            'user': self.std_user.id,
        })
        response = self.std_client.get('/dmp/dmptprojects/')
        content = json.loads(response.content)
        self.assertIn('title', content[0].keys())
        self.assertIn('rdmo_project', content[0].keys())

    def test_user_get_multiple_projects(self):
        self.assertEqual(0, len(Project.objects.all()))
        self.assertEqual(0, len(DmptProject.objects.all()))

        rdmo_ids = []
        for i in range(0, 5):
            rdmo_ids.append(
                Project.objects.create(title='Unit Test {}'.format(i)).pk)

        for r in rdmo_ids[0:2]:
            self.std_client.post('/dmp/dmptprojects/', {
                'rdmo_project': r,
                'user': self.std_user.id,
            })
        for r in rdmo_ids[2:]:
            self.std_client_2.post('/dmp/dmptprojects/', {
                'rdmo_project': r,
                'user': self.std_user_2.id,
            })

        response = self.std_client.get('/dmp/dmptprojects/')
        content_1 = json.loads(response.content)

        response = self.std_client_2.get('/dmp/dmptprojects/')
        content_2 = json.loads(response.content)

        self.assertEqual(2, len(content_1))
        self.assertEqual(3, len(content_2))

        self.assertEqual(self.std_user.id, content_1[0].get('user'))
        self.assertEqual(self.std_user_2.id, content_2[0].get('user'))


class TestDmptProjectViews(TestCase):

    @classmethod
    def setUpTestData(cls):
        # FIXME: needs api group created by rdmo management script. useless otherwise
        Group.objects.create(name="api")
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

        cls.user_3 = User.objects.create_user(
            username="jane",
            email="jane@doe.de",
            password="b@r",
            is_staff=False,
            is_superuser=False,
        )
        token = Token.objects.create(user=cls.user_3)
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        cls.client_3 = client

    def test_get_with_initial_app_request(self):
        self.client_1.login(username="john", password="secret")
        self.client_1.get("/dmp/create/")
        self.client_2.login(username="joe", password="f00")
        self.client_2.get("/dmp/create/")

        dp = Project.objects.create(title='Unit Test')
        response = self.client_1.post('/dmp/dmptprojects/', {
            'rdmo_project': dp.id,
            'user': self.user_1.id,
        })

        response = self.client_1.get('/dmp/dmptprojects/')
        content = json.loads(response.content)
        self.assertEqual(1, len(content))

        response = self.client_2.get('/dmp/dmptprojects/')
        content = json.loads(response.content)
        self.assertEqual(0, len(content))

        response = self.client_2.get('/dmp/dmptprojects/{0}/'.format(dp.pk))
        self.assertEqual(404, response.status_code)

    # FIXME: error when not superuser. maybe related to rdmo mangement commands to create groups etc.
    def test_get_dmp_pdf_logged_in(self):
        self.client_1.login(username="john", password="secret")
        self.client_2.login(username="joe", password="f00")
        # self.client_2.get("/dmp/create/")
        catalog, status = Catalog.objects.get_or_create(key="testkey")
        project, status = Project.objects.get_or_create(title="Test",
                                                        catalog=catalog)
        response = self.client_1.get(
            "/dmp/export/{project_pk}/pdf".format(project_pk=project.pk),
            follow=True)
        self.assertEquals(response.get("Content-Type"), "application/pdf")

        # response = self.client_2.get("/dmp/export/{project.pk}/pdf",
        #                              follow=True)
        # print(response.status_code)
        # print(response.content)

    # def test_anonymous_request(self):


class TestDmptProjectDetailView(TestCase):

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

        rdmo_project = Project.objects.create(title='Unit Test 1')
        DmptProject.objects.create(user=cls.user_1, rdmo_project=rdmo_project)
        rdmo_project = Project.objects.create(title='Unit Test 2')
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

    def test_db_content(self):
        self.assertEqual(2, len(Project.objects.all()))
        self.assertEqual(2, len(DmptProject.objects.all()))

    def test_unauthorized_get(self):
        response = self.client.get('/dmp/dmptprojects/1/')
        self.assertEqual(401, response.status_code)

    def test_invalid_token_get(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Token 1234xxx1234')
        response = client.get('/dmp/dmptprojects/1/')
        self.assertEqual(401, response.status_code)

    def test_invalid_password_get(self):
        client = APIClient()
        client.login(username='john', password='invalid')
        response = client.get('/dmp/dmptprojects/1/')
        self.assertEqual(401, response.status_code)

    def test_valid_get(self):
        dp = DmptProject.objects.first()
        response = self.client_1.get('/dmp/dmptprojects/{}/'.format(dp.pk))
        self.assertEqual(200, response.status_code)
        content = json.loads(response.content)
        self.assertIn('rdmo_project', content.keys())

    def test_not_owner_get(self):
        dp = DmptProject.objects.first()
        response = self.client_2.get('/dmp/dmptprojects/{}/'.format(dp.pk))
        self.assertEqual(403, response.status_code)

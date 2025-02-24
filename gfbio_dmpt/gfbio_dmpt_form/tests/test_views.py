# -*- coding: utf-8 -*-
import json
import os

import responses
from django.conf import settings
from django.contrib.auth.models import Group
from django.contrib.sites.models import Site
from django.test import TestCase
from rdmo.projects.models.project import Project
from rdmo.questions.models.catalog import Catalog
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

from gfbio_dmpt.gfbio_dmpt_form.models import DmptProject, DmptIssue
from gfbio_dmpt.users.models import User


def _get_test_data_dir_path():
    return "{0}{1}gfbio_dmpt{1}gfbio_dmpt_form{1}tests{1}test_data".format(
        os.getcwd(),
        os.sep,
    )


def _get_jira_issue_response():
    with open(
        os.path.join(_get_test_data_dir_path(), "jira_issue_response.json"), "r"
    ) as data_file:
        return json.load(data_file)


# FIXME: Catalog is now different, no key
class TestDmptFrontendView(TestCase):
    @classmethod
    def setUpTestData(cls):
        Group.objects.create(name="api")
        Catalog.objects.create(uri_path="GFBio", title_lang1="GFBio test catalog")
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


# FIXME: Catalog is now different, no key
class TestDmpExportView(TestCase):
    @classmethod
    def setUpTestData(cls):
        Group.objects.create(name="api")
        Catalog.objects.create(uri_path="GFBio", title_lang1="GFBio test catalog")
        cls.std_user = User.objects.create_user(
            username="john",
            email="john@doe.de",
            password="secret",
            is_staff=False,
            is_superuser=False,
        )

        cls.std_user_2 = User.objects.create_user(
            username="anonymous-rabbit",
            email="anonymous@rabbit.de",
            password="carrot",
            is_staff=False,
            is_superuser=False,
        )

        cls.std_user_3 = User.objects.create_user(
            username="anonymous-rabbit-two",
            email="anonymous@rabbit2.de",
            password="carrot2",
            is_staff=False,
            is_superuser=False,
        )

    def test_that_anonymous_rabbit_can_download_its_dmp(self):
        user = User.objects.get(username="anonymous-rabbit")

        catalog = Catalog.objects.create(uri_path="rabbitcatalogue")
        project = Project.objects.create(title="rabbitproject", catalog=catalog)
        user.projects.add(project)
        response = self.client.get(
            f"/dmp/export/{project.pk}/pdf?username=anonymous-rabbit"
        )
        self.assertEqual(200, response.status_code)
        self.assertEqual(response["content-type"], "application/pdf")

    def test_that_anonymous_rabbit_two_can_not_download_others_dmp(self):
        catalog = Catalog.objects.create(uri_path="rabbitcatalogue")
        # site = Site.objects.create(name="rabbithole-x", domain="rabbithole.carrot.org")
        site = Site.objects.first()
        project = Project.objects.create(
            title="rabbitproject",
            catalog=catalog,
            site=site,
        )
        user = User.objects.get(username="anonymous-rabbit")
        user_two = User.objects.get(username="anonymous-rabbit-two")
        user.projects.add(project)
        response = self.client.get(
            f"/dmp/export/{project.pk}/pdf?username={user_two.username}"
        )
        # FIXME: code ok, but access like above throws an exception which has to be catched or silenced
        self.assertEqual(403, response.status_code)


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
        response = self.client.post("/dmp/dmptprojects/", {})
        self.assertEqual(401, response.status_code)

    def test_user_post(self):
        dp = Project.objects.create(title="Unit Test")
        response = self.std_client.post(
            "/dmp/dmptprojects/",
            {
                "rdmo_project": dp.id,
                "user": self.std_user.id,
            },
        )
        self.assertEqual(201, response.status_code)
        content = json.loads(response.content)
        self.assertIn("rdmo_project", content.keys())
        self.assertEqual(dp.id, content.get("rdmo_project", "invalid_id"))

    def test_unauthorized_get(self):
        response = self.client.get("/dmp/dmptprojects/")
        self.assertEqual(401, response.status_code)

    def test_user_get_empty(self):
        response = self.std_client.get("/dmp/dmptprojects/")
        self.assertEqual(200, response.status_code)
        self.assertEqual([], json.loads(response.content))

    def test_user_get_content(self):
        dp = Project.objects.create(title="Unit Test")
        self.std_client.post(
            "/dmp/dmptprojects/",
            {
                "rdmo_project": dp.id,
                "user": self.std_user.id,
            },
        )
        response = self.std_client.get("/dmp/dmptprojects/")
        self.assertEqual(200, response.status_code)
        content = json.loads(response.content)
        self.assertIsInstance(content, list)
        self.assertEqual(1, len(content))

    def test_get_content_structure(self):
        dp = Project.objects.create(title="Unit Test")
        self.std_client.post(
            "/dmp/dmptprojects/",
            {
                "rdmo_project": dp.id,
                "user": self.std_user.id,
            },
        )
        response = self.std_client.get("/dmp/dmptprojects/")
        content = json.loads(response.content)
        self.assertIn("title", content[0].keys())
        self.assertIn("rdmo_project", content[0].keys())
        self.assertIn("issue", content[0].keys())
        self.assertEqual(0, len(content[0].get('issue')))

    def test_get_content_structure_with_issue(self):
        dp = Project.objects.create(title="Unit Test")
        self.std_client.post(
            "/dmp/dmptprojects/",
            {
                "rdmo_project": dp.id,
                "user": self.std_user.id,
            },
        )
        dmpt_project = DmptProject.objects.first()
        issue_key = 'TEST-123'
        DmptIssue.objects.create(issue_key=issue_key, dmpt_project=dmpt_project,
                                 rdmo_project=dmpt_project.rdmo_project)
        response = self.std_client.get("/dmp/dmptprojects/")
        content = json.loads(response.content)
        self.assertIn("title", content[0].keys())
        self.assertIn("rdmo_project", content[0].keys())
        self.assertIn("issue", content[0].keys())
        self.assertEqual(issue_key, content[0].get('issue'))

    def test_user_get_multiple_projects(self):
        self.assertEqual(0, len(Project.objects.all()))
        self.assertEqual(0, len(DmptProject.objects.all()))

        rdmo_ids = []
        for i in range(0, 5):
            rdmo_ids.append(Project.objects.create(title="Unit Test {}".format(i)).pk)

        for r in rdmo_ids[0:2]:
            self.std_client.post(
                "/dmp/dmptprojects/",
                {
                    "rdmo_project": r,
                    "user": self.std_user.id,
                },
            )
        for r in rdmo_ids[2:]:
            self.std_client_2.post(
                "/dmp/dmptprojects/",
                {
                    "rdmo_project": r,
                    "user": self.std_user_2.id,
                },
            )

        response = self.std_client.get("/dmp/dmptprojects/")
        content_1 = json.loads(response.content)

        response = self.std_client_2.get("/dmp/dmptprojects/")
        content_2 = json.loads(response.content)

        self.assertEqual(2, len(content_1))
        self.assertEqual(3, len(content_2))

        self.assertEqual(self.std_user.id, content_1[0].get("user"))
        self.assertEqual(self.std_user_2.id, content_2[0].get("user"))


class TestDmptSupportView(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.issue_json = _get_jira_issue_response()
        cls.std_user = User.objects.create_user(
            username="john",
            email="john@doe.de",
            password="secret",
            is_staff=False,
            is_superuser=False,
        )

    @staticmethod
    def _add_gfbio_helpdesk_user_service_response(
        user_name="regular_user", email="re@gu.la"
    ):
        url = (
            "https://helpdesk.gfbio.org/internal/getorcreateuser.php"
            "?username={0}&email={1}".format(
                user_name,
                email,
            )
        )
        responses.add(responses.GET, url, body="regular_user", status=200)
        responses.add(responses.GET, url, body=b"deleteMe", status=200)

    @staticmethod
    def _add_jira_client_responses():
        responses.add(
            responses.GET,
            "{0}/rest/api/2/field".format(settings.JIRA_URL),
            status=200,
        )

    def _add_create_ticket_response(self):
        self._add_gfbio_helpdesk_user_service_response(
            user_name="gfbiodmpt", email="horst@horst.de"
        )
        self._add_jira_client_responses()
        responses.add(
            responses.POST,
            "{0}{1}".format(settings.JIRA_URL, "/rest/api/2/issue"),
            json=self.issue_json,
            status=200,
        )

        responses.add(
            responses.GET,
            "{0}/rest/api/2/issue/SAND-1661".format(settings.JIRA_URL),
            json=self.issue_json,
        )

    @responses.activate
    def test_valid_post(self):
        self._add_create_ticket_response()
        url = 'https://helpdesk.gfbio.org/internal/getorcreateuser.php?username={0}&email={1}'.format('horst@horst.de',
                                                                                                      'horst@horst.de', )
        responses.add(responses.GET, url, body=b'deleteMe', status=200)

        rdmo_project = Project.objects.create(title="Support View Test 1")
        data = {
            "rdmo_project_id": rdmo_project.id,
            "email": "horst@horst.de",
            "message": "foo bar",
            "data_collection_and_assurance": False,
            "data_curation": True,
        }

        response = self.client.post("/dmp/support/", data)
        self.assertEqual(201, response.status_code)
        self.assertEqual(1, len(DmptIssue.objects.all()))

    @responses.activate
    def test_valid_post_with_existing_dmp_project(self):
        self._add_create_ticket_response()
        url = 'https://helpdesk.gfbio.org/internal/getorcreateuser.php?username={0}&email={1}'.format('horst@horst.de',
                                                                                                      'horst@horst.de', )
        responses.add(responses.GET, url, body=b'deleteMe', status=200)
        rdmo_project = Project.objects.create(title="Support View Test 1")
        dmpt_project = DmptProject.objects.create(rdmo_project=rdmo_project, user=self.std_user)
        data = {
            "rdmo_project_id": rdmo_project.id,
            "email": "horst@horst.de",
            "message": "foo bar",
            "data_collection_and_assurance": False,
            "data_curation": True,
        }

        response = self.client.post("/dmp/support/", data)
        self.assertEqual(201, response.status_code)
        self.assertEqual(1, len(DmptIssue.objects.all()))
        dmpt_issue = DmptIssue.objects.first()
        rdmo_project = Project.objects.get(id=rdmo_project.id)
        dmpt_project = DmptProject.objects.get(id=dmpt_project.id)
        self.assertEqual(dmpt_issue, dmpt_project.issue)
        self.assertEqual(dmpt_issue, rdmo_project.dmptproject.issue)

    def test_invalid_post(self):
        data = {
            "email": "sfdde",
            "data_collection_and_assurance": False,
        }

        initial_dmpt_issues = len(DmptIssue.objects.all())

        response = self.client.post("/dmp/support/", data)
        self.assertEqual(400, response.status_code)
        content = json.loads(response.content)
        self.assertIn("email", content.keys())
        self.assertEqual(initial_dmpt_issues, len(DmptIssue.objects.all()))

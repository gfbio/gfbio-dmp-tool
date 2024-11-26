from django.test import TestCase
from rdmo.projects.models import Project
from rdmo.questions.models import Catalog

from gfbio_dmpt.gfbio_dmpt_form.models import DmptProject
from gfbio_dmpt.gfbio_dmpt_form.serializers.dmpt_serializers import (
    RdmoProjectValuesSerializer,
    RdmoProjectValuesUpdateSerializer,
)
from gfbio_dmpt.users.models import User


class TestRdmoProjectValuesSerializer(TestCase):
    fixtures = ["dumps/rdmo_testinstance_dump.json"]

    def setUp(self):
        self.catalog = Catalog.objects.get(id=18)

    def test_valid_data(self):
        data = {
            "catalog": self.catalog.id,
            "title": "Valid Project Title",
            "form_data": {"key": "value"}
        }
        serializer = RdmoProjectValuesSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_invalid_catalog_id(self):
        data = {
            "catalog": 999,
            "title": "Valid Project Title",
            "form_data": {"key": "value"}
        }
        serializer = RdmoProjectValuesSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('catalog', serializer.errors)

    def test_missing_title(self):
        data = {
            "catalog": self.catalog.id,
            "form_data": {"key": "value"}
        }
        serializer = RdmoProjectValuesSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('title', serializer.errors)

    def test_invalid_title_length(self):
        data = {
            "catalog": self.catalog.id,
            "title": "A" * 256,  # Title length exceeds max_length of 255
            "form_data": {"key": "value"}
        }
        serializer = RdmoProjectValuesSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('title', serializer.errors)

    def test_missing_form_data(self):
        data = {
            "catalog": self.catalog.id,
            "title": "Valid Project Title"
        }
        serializer = RdmoProjectValuesSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('form_data', serializer.errors)


class TestRdmoProjectValuesUpdateSerializer(TestCase):
    fixtures = ["dumps/rdmo_testinstance_dump.json"]

    def setUp(self):
        test_user = User.objects.create_user(
            username="john",
            email="john@doe.de",
            password="secret",
            is_staff=False,
            is_superuser=False,
        )
        self.catalog = Catalog.objects.get(id=18)
        self.project = Project.objects.create(title="Test Project", catalog=self.catalog)
        self.dmpt_project = DmptProject.objects.create(user_id=test_user.pk, rdmo_project=self.project)

    def test_valid_data(self):
        data = {
            "dmpt_project": self.dmpt_project.id,
            "title": "Updated Project Title",
            "form_data": {"key": "value"}
        }
        serializer = RdmoProjectValuesUpdateSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_invalid_dmpt_project_id(self):
        data = {
            "dmpt_project": 999,
            "title": "Updated Project Title",
            "form_data": {"key": "value"}
        }
        serializer = RdmoProjectValuesUpdateSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('dmpt_project', serializer.errors)

    def test_missing_title(self):
        data = {
            "dmpt_project": self.dmpt_project.id,
            "form_data": {"key": "value"}
        }
        serializer = RdmoProjectValuesUpdateSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('title', serializer.errors)

    def test_invalid_title_length(self):
        data = {
            "dmpt_project": self.dmpt_project.id,
            "title": "A" * 256,  # Title length exceeds max_length of 255
            "form_data": {"key": "value"}
        }
        serializer = RdmoProjectValuesUpdateSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('title', serializer.errors)

    def test_missing_form_data(self):
        data = {
            "dmpt_project": self.dmpt_project.id,
            "title": "Updated Project Title"
        }
        serializer = RdmoProjectValuesUpdateSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('form_data', serializer.errors)

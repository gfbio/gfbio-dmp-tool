# -*- coding: utf-8 -*-

from django.test import TestCase
from rdmo.projects.models import Project

from gfbio_dmpt.gfbio_dmpt_form.models import DmptProject
from gfbio_dmpt.users.models import User


class TestDmptProject(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.std_user = User.objects.create_user(
            username="john",
            email="john@doe.de",
            password="secret",
            is_staff=False,
            is_superuser=False,
        )

    def test_instance(self):
        rp = Project.objects.create()
        dmpt_project = DmptProject.objects.create(
            rdmo_project=rp, user=self.std_user)
        self.assertEqual(self.std_user.id, dmpt_project.user.id)
        self.assertEqual(rp.pk, dmpt_project.rdmo_project.pk)

    def test_str(self):
        rp = Project.objects.create(title='foo_bar')
        dmpt_project = DmptProject.objects.create(
            rdmo_project=rp, user=self.std_user)
        self.assertEqual('foo_bar', dmpt_project.__str__())

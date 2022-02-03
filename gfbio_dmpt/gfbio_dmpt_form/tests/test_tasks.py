# -*- coding: utf-8 -*-

from django.test import TestCase
from rdmo.projects.models import Project

from gfbio_dmpt.gfbio_dmpt_form.models import DmptProject
from gfbio_dmpt.gfbio_dmpt_form.tasks import delete_temporary_rdmo_projects_task
from gfbio_dmpt.users.models import User


class TestDeleteRdmoProjectTask(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.std_user = User.objects.create_user(
            username="john",
            email="john@doe.de",
            password="secret",
            is_staff=False,
            is_superuser=False,
        )
        rdmo_p = Project.objects.create(title='Unit Test 1')
        cls.dmp = DmptProject.objects.create(rdmo_project=rdmo_p,
                                             user=cls.std_user)

        Project.objects.create(title='Unit Test 2 tmp')
        Project.objects.create(title='Unit Test 3 tmp')

    def test_delete_temporary_rdmo_projects_task(self):
        self.assertEqual(3, len(Project.objects.all()))
        delete_temporary_rdmo_projects_task.apply()
        self.assertEqual(1, len(Project.objects.all()))

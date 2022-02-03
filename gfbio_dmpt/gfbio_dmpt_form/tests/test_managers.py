# -*- coding: utf-8 -*-
import datetime

from django.test import TestCase
from rdmo.projects.models import Project

from gfbio_dmpt.gfbio_dmpt_form.models import DmptProject
from gfbio_dmpt.users.models import User


class TestDmptProjectManager(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.std_user = User.objects.create_user(
            username="john",
            email="john@doe.de",
            password="secret",
            is_staff=False,
            is_superuser=False,
        )
        # has dmp project, created in less than 1 day (today) -> expect no delete
        rdmo_1 = Project.objects.create(title='Unit Test 1')
        cls.dmp_1 = DmptProject.objects.create(rdmo_project=rdmo_1,
                                               user=cls.std_user)

        # has dmp project, created in more than 1 day (from today) -> expect no delete
        rdmo_2 = Project.objects.create(title='Unit Test 2')
        rdmo_2.created = rdmo_2.created.replace(
            day=datetime.datetime.now().day - 2)
        rdmo_2.save()
        cls.dmp_2 = DmptProject.objects.create(rdmo_project=rdmo_2,
                                               user=cls.std_user)

        # has no dmp project, created in more than 1 day (from today) -> expect delete
        rdmo_3 = Project.objects.create(title='Unit Test 3 tmp')
        rdmo_3.created = rdmo_3.created.replace(day=rdmo_3.created.day - 1)
        rdmo_3.save()

        # has no dmp project, created in less than 1 day (today) -> expect no delete
        Project.objects.create(title='Unit Test 4 tmp')

        # has no dmp project, created in less than 1 day (today) -> expect no delete
        Project.objects.create(title='Unit Test 5 tmp')

    def test_db_content(self):
        self.assertEqual(5, len(Project.objects.all()))
        self.assertEqual(2, len(DmptProject.objects.all()))

    def test_delete_temporary_rdmo_projects(self):
        self.assertEqual(5, len(Project.objects.all()))
        self.assertEqual(1,
                         len(Project.objects.filter(title='Unit Test 3 tmp')))
        self.assertEqual(2,
                         len(Project.objects.filter(dmptproject__isnull=False)))
        number, deletions_per_type = DmptProject.objects.delete_temporary_rdmo_projects()
        self.assertEqual(1, number)
        self.assertGreater(1, len(Project.objects.filter(title='Unit Test 3 tmp')))
        self.assertEqual(4, len(Project.objects.all()))
        self.assertEqual(2,
                         len(Project.objects.filter(dmptproject__isnull=False)))

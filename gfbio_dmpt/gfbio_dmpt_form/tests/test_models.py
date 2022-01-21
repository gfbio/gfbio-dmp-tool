# -*- coding: utf-8 -*-
import json
from pprint import pp

from django.test import TestCase
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient
from rdmo.projects.models import Project
from gfbio_dmpt.users.models import User


class TestDmptProject(TestCase):

    def test_unrelated_instance(self):
        pass
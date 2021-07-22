# -*- coding: utf-8 -*-
import json
from pprint import pp

from django.test import TestCase
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

from gfbio_dmpt.users.models import User


class RdmoRequestTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        user = User.objects.create_user(
            username='kevin', email='kevin@kevin.de', password='secret',
            is_staff=True)
        token = Token.objects.create(user=user)
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        cls.staff_client = client

    def test_get_catalog(self):
        response = self.staff_client.get(
            '/api/v1/projects/projects/'
        )
        print(response.status_code)
        content = json.loads(response.content)
        pp(content)

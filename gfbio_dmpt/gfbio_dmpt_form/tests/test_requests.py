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
            username="kevin", email="kevin@kevin.de", password="secret",
            is_staff=True
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

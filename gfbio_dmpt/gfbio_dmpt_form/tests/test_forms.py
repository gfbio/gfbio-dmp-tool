# -*- coding: utf-8 -*-
from django.test import TestCase

from ..forms import DmptSupportForm


class TestDmptSupportForm(TestCase):

    def test_full_data(self):
        form = DmptSupportForm(
            {
                'rdmo_project_id': 19,
                'email': 'sfd@sodfin.de',
                'message': 'foo bar',
                'data_collection_and_assurance': True,
                'data_curation': True,
                'data_archiving': True,
                'data_visualization_and_analysis': True,
                'terminology_service': True,
                'data_publication': True,
                'data_management_training': True
            }
        )
        self.assertTrue(form.is_valid())

    def test_partial_data(self):
        form = DmptSupportForm(
            {
                'email': 'sfd@sodfin.de',
                'rdmo_project_id': 19,
                'message': 'foo bar',
                'data_collection_and_assurance': False,
                'data_curation': True,
            }
        )
        self.assertTrue(form.is_valid())

    def test_validation(self):
        form = DmptSupportForm(
            {
                'email': 'sfd.de',
                'message': 'foo bar',
                'data_collection_and_assurance': 0,
            }
        )
        self.assertFalse(form.is_valid())
        self.assertIn('email', form.errors.as_data().keys())

    def test_extra_fields(self):
        form = DmptSupportForm(
            {
                'email': 'sfd@sodfin.de',
                'message': 'foo bar',
                'data_collection_and_assurance': False,
                'data_curation': True,
                'foo': 'bar',
            }
        )
        self.assertTrue(form.is_valid())
        self.assertNotIn('foo', form.cleaned_data.keys())

    def test_user_id(self):
        form = DmptSupportForm(
            {
                'email': 'sfd@sodfin.de',
                'rdmo_project_id': 19,
                'user_id': 23,
                'message': 'foo bar',
                'data_collection_and_assurance': False,
                'data_curation': True,
            }
        )
        self.assertTrue(form.is_valid())
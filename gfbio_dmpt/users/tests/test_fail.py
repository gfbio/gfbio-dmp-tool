# -*- coding: utf-8 -*-


from django.test import TestCase


class FailTest(TestCase):

    def test_fail(self):
        self.assertTrue(False)

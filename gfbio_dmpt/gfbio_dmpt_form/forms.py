# -*- coding: utf-8 -*-

from django import forms


class DmptSupportForm(forms.Form):
    email = forms.EmailField(required=True)
    message = forms.CharField(required=True)
    data_collection_and_assurance = forms.BooleanField(required=False)
    data_curation = forms.BooleanField(required=False)
    data_archiving = forms.BooleanField(required=False)
    terminology_service = forms.BooleanField(required=False)
    data_visualization_and_analysis = forms.BooleanField(required=False)
    data_publication = forms.BooleanField(required=False)
    data_management_training = forms.BooleanField(required=False)

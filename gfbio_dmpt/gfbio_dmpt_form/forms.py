# -*- coding: utf-8 -*-

from django import forms


class GFBioDmptForm(forms.Form):
    title = forms.CharField(required=True, max_length=128)
    description = forms.CharField(required=True, widget=forms.Textarea)

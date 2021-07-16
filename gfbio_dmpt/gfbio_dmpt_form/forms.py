# -*- coding: utf-8 -*-

from django import forms


class GFBioDmptForm(forms.Form):
    title = forms.CharField(required=True, max_length=128)
    description = forms.CharField(required=True, widget=forms.Textarea)


# testing multi-forms ----------------

class ContactForm1(forms.Form):
    subject = forms.CharField(max_length=100)
    sender = forms.EmailField()


class ContactForm2(forms.Form):
    message = forms.CharField(widget=forms.Textarea)


class ContactForm3(forms.Form):
    terms = forms.BooleanField()


class ContactForm4(forms.Form):
    privacy_level = forms.IntegerField(max_value=10)

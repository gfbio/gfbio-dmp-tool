# -*- coding: utf-8 -*-

from django import forms


# gfbio dmpt forms -------------------------------------

class GeneralInformationForm(forms.Form):
    project_name = forms.CharField(required=True)
    category = forms.ChoiceField(choices=[
        # ('Select', 'Select'),
        ('Algae & Protists ', 'Algae & Protists'),
        ('Bacteriology, Virology', 'Bacteriology, Virology'),
        ('Botany', 'Botany'),
        ('Ecology & Environment', 'Ecology & Environment'),
        ('Geoscience', 'Geoscience'),
        ('Microbiology', 'Microbiology'),
        ('Mycology', 'Mycology'),
        ('Palaeontology', 'Palaeontology'),
        ('Zoology', 'Zoology'),
        ('Other', 'Other'),

    ])
    reproducible = forms.ChoiceField(widget=forms.CheckboxInput, choices=[
        ('One-time observation', 'One-time observation'),
        ('Repeatable experiments', 'Repeatable experiments'),
        ('Time series', 'Time series'),
    ])
    reproducible_information = forms.CharField(widget=forms.Textarea)
    project_type = forms.ChoiceField(widget=forms.CheckboxInput, choices=[
        ('Field Work', 'Field Work'),
        ('Simulation', 'Simulation'),
        ('Observational', 'Observational'),
        ('Assimilation', 'Assimilation'),
        ('Experimental', 'Experimental'),
        ('Modelling', 'Modelling'),
        ('Laboratory', 'Laboratory'),
        ('Other', 'Other'),
    ])
    project_abstract = forms.CharField(widget=forms.Textarea)
    contact_name = forms.CharField(required=True)
    contact_phone = forms.CharField()
    contact_email = forms.EmailField(required=True)

    # TODO: dynamically growing list of text fields
    principal_investigators = forms.CharField()
    pi_same_as_contact = forms.BooleanField()

    # TODO: dynamical creates 1 or 2 textfields below
    funding = forms.ChoiceField(choices=[
        (
            'DFG Individual Grants Programmes',
            'DFG Individual Grants Programmes'),
        ('DFG Coordinated Programmes', 'DFG Coordinated Programmes'),
        ('DFG Excellence Strategy', 'DFG Excellence Strategy'),
        ('DFG Research Infrastructure', 'DFG Research Infrastructure'),
        ('Other', 'Other'),
        ('None', 'None'),
    ])
    management_coordination = forms.CharField(widget=forms.Textarea)
    member_of_research_group = forms.BooleanField()
    total_budget = forms.CharField()
    rdm_guidelines = forms.ChoiceField(choices=[
        ('DFG Guidelines on the Handling of Research Data',
         'DFG Guidelines on the Handling of Research Data'),
        (
        'DFG Guidelines on the Handling of Research Data in Biodiversity Research',
        'DFG Guidelines on the Handling of Research Data in Biodiversity Research'),
        ('DFG Guidelines for Safeguarding Good Scientific Practice',
         'DFG Guidelines for Safeguarding Good Scientific Practice'),
        ('Other', 'Other'),
        ('None', 'None'),
    ])


class DataCollectionForm(forms.Form):
    pass_data_form = forms.BooleanField()


class DocumentationAndMetadataForm(forms.Form):
    pass_documentation_form = forms.BooleanField()


class EthnicsAndLegalComplianceForm(forms.Form):
    pass_ethics_form = forms.BooleanField()


class PreservationAndSharingForm(forms.Form):
    pass_preservation_form = forms.BooleanField()


# tesing -------------------------------------------------

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

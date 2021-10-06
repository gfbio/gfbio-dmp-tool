# -*- coding: utf-8 -*-
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.views.generic import TemplateView, DetailView
from django.views.generic.list import ListView
from django.views.generic.edit import FormView
# from formtools.wizard.views import SessionWizardView

from .forms import GFBioDmptForm, ContactForm1, ContactForm2, ContactForm4, \
    ContactForm3, GeneralInformationForm, DataCollectionForm, \
    DocumentationAndMetadataForm, EthnicsAndLegalComplianceForm, \
    PreservationAndSharingForm

# rdmo model import
from rdmo.projects.models import Project
from rdmo.projects.views import ProjectAnswersExportView
from rdmo.projects.views import ProjectAnswersView

from rdmo.core.utils import render_to_format

# def dmpt_form_view(request):
#     if request.method == 'POST':
#         form = GFBioDmptForm(request.POST)
#         if form.is_valid():
#             return HttpResponseRedirect('/thanks/')
#
#     else:
#         form = GFBioDmptForm()
#
#     return render(request, 'gfbio_dmpt_form/dmpt_form.html', {'form': form})


class DmptFormView(FormView):
    template_name = 'gfbio_dmpt_form/dmpt_form.html'
    form_class = GFBioDmptForm
    success_url = '/thanks/'

    # TODO: new tmp project on blank form
    # TODO: check for existing temp project
    # TODO: delete old temp projects
    def get(self, request, *args, **kwargs):
        print('CUSTOM_GET')
        return super().get(self, request, *args, **kwargs)

    def form_valid(self, form):
        # This method is called when valid form data has been POSTed.
        # It should return an HttpResponse.

        # form.send_email()
        return super().form_valid(form)


# https://django-formtools.readthedocs.io/en/latest/wizard.html#wizard-template-for-each-form
# class ContactWizard(SessionWizardView):
#     form_list = [ContactForm1, ContactForm2, ContactForm3, ContactForm4]
#
#     def done(self, form_list, **kwargs):
#         # do_something_with_the_form_data(form_list)
#         print('CONTACT WIZARD FORM LIST', form_list)
#         # return HttpResponseRedirect('/page-to-redirect-to-when-done/')
#         return render(self.request, 'done.html', {
#             'form_data': [form.cleaned_data for form in form_list],
#         })
#
#
# class DmptFormWizardView(SessionWizardView):
#     form_list = [GeneralInformationForm, DataCollectionForm,
#                  DocumentationAndMetadataForm, EthnicsAndLegalComplianceForm,
#                  PreservationAndSharingForm]
#
#     template_name = 'gfbio_dmpt_form/dmp_wizard.html'
#
#     def done(self, form_list, **kwargs):
#         # do_something_with_the_form_data(form_list)
#         print('DmptFormWizardView FORM LIST', form_list)
#         return HttpResponseRedirect('/page-to-redirect-to-when-done/')
#         # return render(self.request, 'done.html', {
#         #     'form_data': [form.cleaned_data for form in form_list],
#         # })


# React App in this template
class DmptFrontendView(TemplateView):
    template_name = 'gfbio_dmpt_form/dmpt.html'


# This exports a GFBio branded DMP PDF 
class DmpExportView(ProjectAnswersView):
    model = Project
    template_name = "gfbio_dmpt_export/dmp_export.html"

    def render_to_response(self, context, **response_kwargs):
        #return render_to_format(self.request, context['format'], context['title'], 'projects/project_view_export.html', context)
        return render_to_format(self.request, 'pdf', 'title', 'gfbio_dmpt_export/dmp_export.html', context)




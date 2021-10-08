# -*- coding: utf-8 -*-
from django.conf.urls import url
from django.urls import path

from . import views

app_name = "gfbio_dmpt_form"
urlpatterns = [
    # TODO: clean, get rid of obsolete view and add proper urls for remaining views
    # url(
    #     regex=r'dmpt_form/$',
    #     view=views.DmptFormView.as_view(),
    #     name='gfbio_dmpt_form'
    # ),
    # url('contact/', views.ContactWizard.as_view()),
    # url('dmp/', views.DmptFormWizardView.as_view()),
    url('app/', views.DmptFrontendView.as_view()),
    path('export/<int:pk>/<str:format>', views.DmpExportView.as_view(), name='dmp-detail'),
]

# -*- coding: utf-8 -*-
from django.conf.urls import url

from . import views

app_name = "gfbio_dmpt_form"
urlpatterns = [
    url(
        regex=r'dmpt_form/$',
        view=views.DmptFormView.as_view(),
        name='gfbio_dmpt_form'
    ),
    url('contact/', views.ContactWizard.as_view()),
    url('dmp/', views.DmptFormWizardView.as_view())
]

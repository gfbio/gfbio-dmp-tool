# -*- coding: utf-8 -*-
from django.conf.urls import url
from django.urls import path

from . import views

app_name = "gfbio_dmpt_form"
urlpatterns = [
    url('create/', views.DmptFrontendView.as_view(), name='create_dmp'),

    path('dmptprojects/', views.DmptProjectListView.as_view(), name='dmpt_projects'),
    path('dmptprojects/<int:pk>/', views.DmptProjectDetailView.as_view(), name='dmpt_project_detail'),

    path('export/<int:pk>/<str:format>/', views.DmpExportView.as_view(), name='dmp-detail'),
    path('help/<int:pk>/', views.DmpRequestHelp.as_view(), name='dmp-request-help'),

    path('support/', views.DmptSupportView.as_view(), name='dmpt_support')
]

# -*- coding: utf-8 -*-
from django.urls import path
from django.urls import re_path

from . import views

app_name = "gfbio_dmpt_form"
urlpatterns = [
    re_path(r'^create(/(?P<id>\d+))?/$', views.DmptFrontendView.as_view(), name='create_dmp'),
    path("create/new", views.DmptFrontendView.as_view(), name="create_dmp_new"),
    path("dmptprojects/", views.DmptProjectListView.as_view(), name="dmpt_projects"),
    path(
        "dmptprojects/<int:pk>/",
        views.DmptProjectDetailView.as_view(),
        name="dmpt_project_detail",
    ),
    path(
        "export/<int:pk>/<str:format>", views.DmpExportView.as_view(), name="dmp-detail"
    ),
    path("support/", views.DmptSupportView.as_view(), name="dmpt_support"),
    path(
        "sections/<int:catalog_id>/",
        views.DmptSectionListView.as_view(),
        name="dmpt_sections",
    ),
    path(
        "section/<int:catalog_id>/<int:section_index>/",
        views.DmptSectionDetailView.as_view(),
        name="dmpt_section_detail",
    ),
    # FIXME: from us, not the rdmo equivalent
    # FIXME: rdmo /project/create not working because of update, conflict with rmdo url (which is supposed to be under /rdmo/)
    path("projects/", views.RdmoProjectCreateView.as_view(), name="dmpt_rdmo_projects"),
    path(
        "projects/values/",
        views.DmptRdmoProjectCreateView.as_view(),
        name="dmpt_rdmo_values",
    ),
]

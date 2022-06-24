# -*- coding: utf-8 -*-
from django.conf.urls import url
from django.urls import path

from . import views

app_name = "gfbio_dmpt_form"
urlpatterns = [
    url("create/", views.DmptFrontendView.as_view(), name="create_dmp"),
    url("create/new", views.DmptFrontendView.as_view(), name="create_dmp_new"),
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
    path("projects/", views.RdmoProjectCreateView.as_view(), name="dmpt_rdmo_projects"),
    path(
        "projects/values/",
        views.DmptRdmoProjectCreateView.as_view(),
        name="dmpt_rdmo_values",
    ),
]

# -*- coding: utf-8 -*-
from django.conf.urls import url

from . import views

app_name = "gfbio_dmpt_form"
urlpatterns = [
    url(
        regex=r'dmpt_form/$',
        view=views.dmpt_form_view,
        name='gfbio_dmpt_form'
    ),

]

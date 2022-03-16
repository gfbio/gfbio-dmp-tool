# -*- coding: utf-8 -*-
from django.contrib import admin

from gfbio_dmpt.gfbio_dmpt_form.models import DmptProject, DmptIssue

admin.site.register(DmptProject)
admin.site.register(DmptIssue)

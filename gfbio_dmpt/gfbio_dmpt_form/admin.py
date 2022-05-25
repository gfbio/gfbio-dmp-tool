# -*- coding: utf-8 -*-
from django.contrib import admin

from gfbio_dmpt.gfbio_dmpt_form.models import DmptProject, DmptIssue


class DmptIssueInlineAdmin(admin.TabularInline):
    model = DmptIssue


class DmptProjectAdmin(admin.ModelAdmin):
    inlines = [DmptIssueInlineAdmin, ]


admin.site.register(DmptProject, DmptProjectAdmin)
admin.site.register(DmptIssue)

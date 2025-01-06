# -*- coding: utf-8 -*-
from django.contrib import admin

from gfbio_dmpt.gfbio_dmpt_form.models import DmptProject, DmptIssue
from .models import DmptCatalog

class DmptIssueInlineAdmin(admin.TabularInline):
    model = DmptIssue

class DmptProjectAdmin(admin.ModelAdmin):
    inlines = [DmptIssueInlineAdmin, ]

@admin.register(DmptCatalog)
class DmptCatalogAdmin(admin.ModelAdmin):
    list_display = ('catalog', 'active')
    list_filter = ('active',)
    search_fields = ('catalog__uri',)
    ordering = ('catalog__uri',)
    fieldsets = (
        (None, {
            'fields': ('catalog', 'active'),
            'description': 'Manage the default catalog and its active status.'
        }),
    )

admin.site.register(DmptProject, DmptProjectAdmin)
admin.site.register(DmptIssue)

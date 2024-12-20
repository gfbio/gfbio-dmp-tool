# -*- coding: utf-8 -*-
from django.db import models
from model_utils.models import TimeStampedModel
from rdmo.projects.models import Project
from rdmo.questions.models.catalog import Catalog

from config.settings.base import AUTH_USER_MODEL
from gfbio_dmpt.gfbio_dmpt_form.managers import DmptProjectManager


class DmptProject(TimeStampedModel):
    rdmo_project = models.OneToOneField(Project, on_delete=models.CASCADE)
    user = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE)

    objects = DmptProjectManager()

    def __str__(self):
        return '{0}'.format(self.rdmo_project.title)


class DmptIssue(TimeStampedModel):
    rdmo_project = models.OneToOneField(Project, on_delete=models.CASCADE)
    dmpt_project = models.OneToOneField(DmptProject, null=True, blank=True,
                                        on_delete=models.CASCADE, related_name='issue')
    issue_key = models.CharField(max_length=128)

    def __str__(self):
        return '{0}'.format(self.issue_key)


class DmptCatalog(models.Model):
    catalog = models.OneToOneField(Catalog, on_delete=models.CASCADE)
    active = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.active:
            DmptCatalog.objects.filter(active=True).update(active=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return str(self.catalog.uri) if self.catalog.uri else f'Catalog {self.catalog.id}'

    class Meta:
        app_label = 'gfbio_dmpt_form'

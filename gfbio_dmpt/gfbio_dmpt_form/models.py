# -*- coding: utf-8 -*-
from django.db import models
from model_utils.models import TimeStampedModel
from rdmo.projects.models import Project

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

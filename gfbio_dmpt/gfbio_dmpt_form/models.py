# -*- coding: utf-8 -*-
from model_utils.models import TimeStampedModel

from django.db import models
from rdmo.projects.models import Project

from config.settings.base import AUTH_USER_MODEL
from gfbio_dmpt.gfbio_dmpt_form.managers import DmptProjectManager


class DmptProject(TimeStampedModel):
    # title = models.CharField(max_length=64, blank=True)
    rdmo_project = models.OneToOneField(Project, on_delete=models.CASCADE)
    user = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE)

    objects = DmptProjectManager()

    def __str__(self):
        return '{0}'.format(self.rdmo_project.title)

# -*- coding: utf-8 -*-
from model_utils.models import TimeStampedModel

from django.db import models
from rdmo.projects.models import Project

from config.settings.base import AUTH_USER_MODEL


class DmptProject(TimeStampedModel):
    rdmo_project = models.ForeignKey(Project, on_delete=models.CASCADE)
    user = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE)

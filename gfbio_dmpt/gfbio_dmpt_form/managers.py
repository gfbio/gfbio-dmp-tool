# -*- coding: utf-8 -*-
from django.db import models
from rdmo.projects.models import Project


class DmptProjectManager(models.Manager):

    # Since we should not mess around with rdmo code, we do this here
    @staticmethod
    def delete_temporary_rdmo_projects():
        return Project.objects.filter(dmptproject__isnull=True).delete()

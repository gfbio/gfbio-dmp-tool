# -*- coding: utf-8 -*-
import datetime

from django.db import models
from pytz import timezone
from rdmo.projects.models import Project

from config.settings.base import TIME_ZONE


class DmptProjectManager(models.Manager):

    # Since we should not mess around with rdmo code, we do this here
    @staticmethod
    def delete_temporary_rdmo_projects():
        return Project.objects.filter(
            created__lt=datetime.datetime.now(
                tz=timezone(TIME_ZONE)) - datetime.timedelta(
                days=1)).filter(dmptproject__isnull=True).delete()

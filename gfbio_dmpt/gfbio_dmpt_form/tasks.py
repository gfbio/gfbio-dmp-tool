# -*- coding: utf-8 -*-
import logging

import celery

from .models import DmptProject

logger = logging.getLogger(__name__)


@celery.task()
def delete_temporary_rdmo_projects_task():
    logger.info('tasks.py | delete_temporary_rdmo_projects_task | '
                'start deleting temporary rdmo projects')
    number, deletions_per_type = DmptProject.objects.delete_temporary_rdmo_projects()
    logger.info('tasks.py | delete_temporary_rdmo_projects_task | '
                'objects deleted={0}'.format(number))

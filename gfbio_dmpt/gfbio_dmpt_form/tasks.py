# -*- coding: utf-8 -*-
import logging

import celery

from .jira_utils import get_issue_reporter, create_support_issue, get_rdmo_project_for_project_id
from .models import DmptProject

logger = logging.getLogger(__name__)


@celery.task(name='tasks.delete_temporary_rdmo_projects_task')
def delete_temporary_rdmo_projects_task():
    logger.info('tasks.py | delete_temporary_rdmo_projects_task | '
                'start deleting temporary rdmo projects')
    number, deletions_per_type = DmptProject.objects.delete_temporary_rdmo_projects()
    logger.info('tasks.py | delete_temporary_rdmo_projects_task | '
                'objects deleted={0}'.format(number))


@celery.task(name='tasks.create_support_issue_task')
def create_support_issue_task(form_data={}):
    logger.info(
        f'tasks.py | create_support_issue_task | '
        f'start | {form_data}')

    rdmo_project_id = form_data.get('rdmo_project_id')
    rdmo_project = get_rdmo_project_for_project_id(rdmo_project_id)
    if rdmo_project is None:
        logger.error(
            f'tasks.py | create_support_issue_task | '
            f'error getting rdmo project | rdmo_project_id={rdmo_project_id}')
        return None

    reporter = get_issue_reporter(form_data.get('email'), form_data.get('user_id'))
    return create_support_issue(rdmo_project, reporter)

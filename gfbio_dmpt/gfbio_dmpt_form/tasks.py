# -*- coding: utf-8 -*-
import logging

import celery
from django.conf import settings
from jira import JIRA, JIRAError
from rdmo.projects.models import Project

from .jira_utils import get_issue_reporter, create_support_issue
from .models import DmptProject, DmptIssue

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
    try:
        rdmo_project = Project.objects.get(id=form_data.get('rdmo_project_id'))
    except Project.DoesNotExist as e:
        logger.error(
            f'tasks.py | create_support_issue_task | '
            f'error getting rdmo project | {e}')
        return False

    reporter = get_issue_reporter(form_data)

    return create_support_issue(rdmo_project, reporter)




# -*- coding: utf-8 -*-
import logging
from urllib.parse import quote

import celery
import requests
from django.conf import settings
from jira import JIRA, JIRAError
from rdmo.projects.models import Project

from .configuration.settings import JIRA_USERNAME_URL_TEMPLATE, \
    JIRA_USERNAME_URL_FULLNAME_TEMPLATE, JIRA_FALLBACK_USERNAME
from .models import DmptProject, DmptIssue
from ..users.models import User

logger = logging.getLogger(__name__)


@celery.task(name='tasks.delete_temporary_rdmo_projects_task')
def delete_temporary_rdmo_projects_task():
    logger.info('tasks.py | delete_temporary_rdmo_projects_task | '
                'start deleting temporary rdmo projects')
    number, deletions_per_type = DmptProject.objects.delete_temporary_rdmo_projects()
    logger.info('tasks.py | delete_temporary_rdmo_projects_task | '
                'objects deleted={0}'.format(number))


def _get_gfbio_helpdesk_username(user_name, email, fullname=''):
    url = JIRA_USERNAME_URL_TEMPLATE.format(user_name, email)
    if len(fullname):
        url = JIRA_USERNAME_URL_FULLNAME_TEMPLATE.format(user_name, email,
                                                         quote(fullname))
    return requests.get(url=url, auth=(
        settings.JIRA_ACCOUNT_SERVICE_USER,
        settings.JIRA_ACCOUNT_SERVICE_PASSWORD))


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

    email = form_data.get('email')
    user_id = form_data.get('user_id')
    user = None
    if user_id:
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist as e:
            logger.warning(
                f'tasks.py | create_support_issue_task | '
                f'error getting user by user_id | {e}')
    user_name = JIRA_FALLBACK_USERNAME if user is None else user.username
    response = _get_gfbio_helpdesk_username(user_name=user_name,
                                            email=email, )
    logger.info(
        f'tasks.py | create_support_issue_task | '
        f'process _get_gfbio_helpdesk_username with | user_name={user_name} | '
        f'email={email} | response.content={response.content}')
    reporter = f'{response.content.decode("utf-8")}'

    jira = JIRA(
        server=settings.JIRA_URL,
        basic_auth=(settings.JIRA_USERNAME, settings.JIRA_PASS),
        get_server_info=False,
    )
    try:
        issue = jira.create_issue(
            fields={
                'project': {
                    'key': settings.JIRA_PROJECT
                },
                'summary': 'DMP Support Request for rdmo project {0}'.format(
                    rdmo_project.pk),
                'description': f'Would you please be so kind to help me with my '
                               f'Data Management Plan named "{rdmo_project.title}" '
                               f'using the "{rdmo_project.catalog}" catalog',
                'reporter': {
                    'name': reporter
                },
                'issuetype': {
                    'name': 'Data Submission'
                },
            }
        )
        DmptIssue.objects.create(rdmo_project=rdmo_project, issue_key=issue.key)
        logger.info(
            f'tasks.py | create_support_issue_task | '
            f'issue created | issue={issue}')
        return True
    except JIRAError as e:
        logger.error(
            f'tasks.py | create_support_issue_task | error creating issue | {e.text}')
        return False

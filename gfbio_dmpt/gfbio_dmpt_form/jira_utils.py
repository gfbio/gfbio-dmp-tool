# -*- coding: utf-8 -*-
import logging
from urllib.parse import quote

import requests
from django.conf import settings
from jira import JIRA, JIRAError

from config.settings.base import JIRA_ACCOUNT_SERVICE_USER, JIRA_ACCOUNT_SERVICE_PASSWORD
from .configuration.settings import JIRA_FALLBACK_USERNAME
from .configuration.settings import JIRA_USERNAME_URL_TEMPLATE, \
    JIRA_USERNAME_URL_FULLNAME_TEMPLATE
from .models import DmptIssue
from ..users.models import User

logger = logging.getLogger(__name__)


def _get_gfbio_helpdesk_username(user_name, email, fullname=''):
    url = JIRA_USERNAME_URL_TEMPLATE.format(user_name, email)
    if len(fullname):
        url = JIRA_USERNAME_URL_FULLNAME_TEMPLATE.format(user_name, email,
                                                         quote(fullname))
    return requests.get(url=url, auth=(
        JIRA_ACCOUNT_SERVICE_USER,
        JIRA_ACCOUNT_SERVICE_PASSWORD))


def get_issue_reporter(form_data):
    email = form_data.get('email')
    user_id = form_data.get('user_id')
    user = None
    if user_id:
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist as e:
            logger.warning(
                f'jira_utils.py | get_issue_reporter | '
                f'error getting user by user_id | {e}')
    user_name = JIRA_FALLBACK_USERNAME if user is None else user.username
    response = _get_gfbio_helpdesk_username(user_name=user_name,
                                            email=email, )
    logger.info(
        f'jira_utils.py | get_issue_reporter | '
        f'processed _get_gfbio_helpdesk_username with | user_name={user_name} | '
        f'email={email} | response.content={response.content}')
    reporter = f'{response.content.decode("utf-8")}'
    return reporter


def create_support_issue(rdmo_project, reporter):
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
            f'jira_utils.py | create_support_issue | '
            f'issue created | issue={issue}')
        return issue
    except JIRAError as e:
        logger.error(
            f'jira_utils.py | create_support_issue | error creating issue | {e.text}')
        return None

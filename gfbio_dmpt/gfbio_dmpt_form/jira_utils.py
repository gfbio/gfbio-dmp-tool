# -*- coding: utf-8 -*-
import logging
from urllib.parse import quote

import requests
from django.conf import settings
from jira import JIRA, JIRAError
from rdmo.projects.models import Project

from config.settings.base import (
    JIRA_ACCOUNT_SERVICE_USER,
    JIRA_ACCOUNT_SERVICE_PASSWORD,
)
from .configuration.settings import JIRA_FALLBACK_USERNAME
from .configuration.settings import (
    JIRA_USERNAME_URL_TEMPLATE,
    JIRA_USERNAME_URL_FULLNAME_TEMPLATE,
)
from .models import DmptIssue
from ..users.models import User

logger = logging.getLogger(__name__)


def _get_gfbio_helpdesk_username(user_name, email, fullname=""):
    url = JIRA_USERNAME_URL_TEMPLATE.format(user_name, email)
    if len(fullname):
        url = JIRA_USERNAME_URL_FULLNAME_TEMPLATE.format(
            user_name, email, quote(fullname)
        )
    return requests.get(
        url=url, auth=(JIRA_ACCOUNT_SERVICE_USER, JIRA_ACCOUNT_SERVICE_PASSWORD)
    )


def get_rdmo_project_for_project_id(rdmo_project_id):
    rdmo_project = None
    try:
        rdmo_project = Project.objects.get(id=rdmo_project_id)
    except Project.DoesNotExist as e:
        logger.error(
            f"jira_utils.py | get_rdmo_project_for_project_id | "
            f"error getting rdmo project | {e}"
        )
    return rdmo_project


def get_issue_reporter(email, user_id):
    user = None
    if user_id:
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist as e:
            logger.warning(
                f"jira_utils.py | get_issue_reporter | "
                f"error getting user by user_id | {e}"
            )
    user_name = JIRA_FALLBACK_USERNAME if user is None else user.username
    response = _get_gfbio_helpdesk_username(
        user_name=user_name,
        email=email,
    )
    logger.info(
        f"jira_utils.py | get_issue_reporter | "
        f"processed _get_gfbio_helpdesk_username with | user_name={user_name} | "
        f"email={email} | response.content={response.content}"
    )
    reporter = f'{response.content.decode("utf-8")}'
    return reporter


def create_support_issue(rdmo_project, reporter, message=""):
    jira = JIRA(
        server=settings.JIRA_URL,
        basic_auth=(settings.JIRA_USERNAME, settings.JIRA_PASS),
        get_server_info=False,
    )
    try:
        issue = jira.create_issue(
            fields={
                "project": {"key": settings.JIRA_PROJECT},
                "summary": "DMP Support Request for rdmo project {0}".format(
                    rdmo_project.pk
                ),
                "description": f"Would you please be so kind to help me with my "
                f'Data Management Plan named "{rdmo_project.title}" '
                f'using the "{rdmo_project.catalog}" catalog\n\n{message}',
                "reporter": {"name": reporter},
                "issuetype": {"name": "DMP"},
            }
        )
        DmptIssue.objects.create(rdmo_project=rdmo_project, issue_key=issue.key)
        logger.info(
            f"jira_utils.py | create_support_issue | " f"issue created | issue={issue}"
        )
        return issue
    except JIRAError as e:
        logger.error(
            f"jira_utils.py | create_support_issue | error creating issue | {e.text}"
        )
        return None


def _add_interests_to_message(form_data, message):
    if form_data.get("data_collection_and_assurance", False):
        message += """- Data Collection and Assurance
        """
    if form_data.get("data_curation", False):
        message += """- Data Curation
        """
    if form_data.get("data_archiving", False):
        message += """- Data Archiving
        """
    if form_data.get("terminology_service", False):
        message += """- Terminology Service
        """
    if form_data.get("data_visualization_and_analysis", False):
        message += """- Data Visualization and Analysis
        """
    if form_data.get("data_publication", False):
        message += """- Data Publication
        """
    if form_data.get("data_management_training", False):
        message += """- Data Management Training
           """


def create_support_issue_in_view(form_data={}):
    logger.info(
        f"jira_utils.py | create_support_issue_in_view | " f"start | {form_data}"
    )

    rdmo_project_id = form_data.get("rdmo_project_id")
    rdmo_project = get_rdmo_project_for_project_id(rdmo_project_id)
    if rdmo_project is None:
        logger.error(
            f"jira_utils.py | create_support_issue_in_view | "
            f"error getting rdmo project | rdmo_project_id={rdmo_project_id}"
        )
        return {"error": f"no rdmo project found with id: {rdmo_project_id}"}

    reporter = get_issue_reporter(form_data.get("email"), form_data.get("user_id"))
    message = f"""
    {form_data.get('message')}

    I am interested in:

    """
    _add_interests_to_message(form_data, message)
    issue = create_support_issue(rdmo_project, reporter, message)
    if issue is None:
        return {"error": f"no issue could be created"}
    return {"issue_key": issue.key, "issue_url": issue.self}
    # TODO: only for testing, to avoid creating too many real issues in the helpdesk
    # return {"issue_key": "SAND-1661", "issue_url": "https://www.example.com/rest/api/2/issue/16814"}

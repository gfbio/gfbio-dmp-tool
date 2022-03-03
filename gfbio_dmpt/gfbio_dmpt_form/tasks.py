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
from .models import DmptProject

logger = logging.getLogger(__name__)


@celery.task(name='tasks.delete_temporary_rdmo_projects_task')
def delete_temporary_rdmo_projects_task():
    logger.info('tasks.py | delete_temporary_rdmo_projects_task | '
                'start deleting temporary rdmo projects')
    number, deletions_per_type = DmptProject.objects.delete_temporary_rdmo_projects()
    logger.info('tasks.py | delete_temporary_rdmo_projects_task | '
                'objects deleted={0}'.format(number))


def get_gfbio_helpdesk_username(user_name, email, fullname=''):
    url = JIRA_USERNAME_URL_TEMPLATE.format(user_name, email)
    if len(fullname):
        url = JIRA_USERNAME_URL_FULLNAME_TEMPLATE.format(user_name, email,
                                                         quote(fullname))
    return requests.get(url=url, auth=(
        settings.JIRA_USERNAME,
        settings.JIRA_PASS))


@celery.task(name='tasks.create_support_issue_task')
def create_support_issue_task(form_data={}):
    print('create_support_issue_task')
    # print(form_data)
    try:
        rdmo_project = Project.objects.get(id=form_data.get('rdmo_project_id'))
    except Project.DoesNotExist as e:
        logger.error(
            f'tasks.py | create_support_issue_task | '
            f'error getting rdmo project | {e}')
        return False

    # TODO: if user logged in, get email from there, it will probably no be in the form then
    email = form_data.get('email')
    # TODO: username of user logged in, preferably GOE_ID from user goe field
    user_name = JIRA_FALLBACK_USERNAME
    response = get_gfbio_helpdesk_username(user_name=user_name,
                                           email=email, )
    reporter = f'{response.content.decode("utf-8")}'
    print(reporter)
    print(rdmo_project.title)

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
                'summary': '{0}'.format(rdmo_project.title),
                'description': f"Would you please be so nice and help me with my "
                               f"dmp named '{rdmo_project.title}' "
                               f"using the {rdmo_project.catalog} catalog",
                'reporter': {
                    'name': reporter
                },
                'issuetype': {
                    'name': 'Data Submission'
                },
            }
            # project=settings.JIRA_PROJECT,
            # summary=rmdo_project.title,
            # description=f"Would you please be so nice and help me with my "
            #             f"dmp named '{rmdo_project.title}' "
            #             f"using the {rmdo_project.catalog} catalog",
            # reporter={"name": reporter},
            # issuetype={"name": "Data Submission"},
        )
        print(issue)
    except JIRAError as e:
        logger.error(
            f'tasks.py | create_support_issue_task | error creating issue | {e.text}')

# @celery.task(
#     base=SubmissionTask,
#     bind=True,
#     name='tasks.create_submission_issue_task',
#     autoretry_for=(TransferServerError,
#                    TransferClientError
#                    ),
#     retry_kwargs={'max_retries': SUBMISSION_MAX_RETRIES},
#     retry_backoff=SUBMISSION_RETRY_DELAY,
#     retry_jitter=True
# )
# def create_submission_issue_task(self, prev_task_result=None,
#                                  submission_id=None):
#     submission, site_configuration = get_submission_and_site_configuration(
#         submission_id=submission_id,
#         task=self,
#         include_closed=True
#     )
#     if submission == TaskProgressReport.CANCELLED:
#         return TaskProgressReport.CANCELLED
#     # TODO: test task without check for null, what happens when errors occur here, not caused inside a
#     #  method called here
#
#     # TODO: only needed for comment on ticket, thus remove
#     # TODO: althouht filter for primary should deliver only on ticket, a dedicated manager method
#     #   would be cleaner (no .first() on query set)
#     # existing_tickets = submission.additionalreference_set.filter(
#     #     Q(type=AdditionalReference.GFBIO_HELPDESK_TICKET) & Q(primary=True))
#
#     jira_client = JiraClient(resource=site_configuration.helpdesk_server)
#     jira_client.create_submission_issue(reporter=prev_task_result,
#                                         site_config=site_configuration,
#                                         submission=submission)
#
#     jira_error_auto_retry(jira_client=jira_client, task=self,
#                           broker_submission_id=submission.broker_submission_id)
#     if jira_client.issue:
#         submission.additionalreference_set.create(
#             type=AdditionalReference.GFBIO_HELPDESK_TICKET,
#             reference_key=jira_client.issue.key,
#             primary=True
#         )

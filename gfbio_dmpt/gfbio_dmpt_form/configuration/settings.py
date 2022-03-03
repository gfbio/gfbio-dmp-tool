# -*- coding: utf-8 -*-

from builtins import getattr

settings = {}

JIRA_USERNAME_URL_TEMPLATE = getattr(
    settings,
    'JIRA_USERNAME_URL_TEMPLATE',
    'https://helpdesk.gfbio.org/internal/getorcreateuser.php?username={0}&email={1}'
)

JIRA_USERNAME_URL_FULLNAME_TEMPLATE = getattr(
    settings,
    'JIRA_USERNAME_URL_TEMPLATE',
    'https://helpdesk.gfbio.org/internal/getorcreateuser.php?username={0}&email={1}&fullname={2}'
)

# https://helpdesk.gfbio.org/secure/ViewProfile.jspa?name=gfbiodmpt
JIRA_FALLBACK_USERNAME = getattr(
    settings,
    'JIRA_FALLBACK_USERNAME',
    'gfbiodmpt'
)

# import default settings from rdmo
import os

from django.conf.global_settings import CSRF_COOKIE_PATH, LANGUAGE_COOKIE_PATH, \
    SESSION_COOKIE_PATH, CSRF_COOKIE_SECURE
from django.template.defaulttags import csrf_token
from rdmo.core.settings import *

from .base import *  # noqa
from .base import env

# GENERAL
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#debug

DEBUG = True
# https://docs.djangoproject.com/en/dev/ref/settings/#secret-key
SECRET_KEY = env(
    "DJANGO_SECRET_KEY",
    default="1XZItpEXPzkxub6r5uJRGEn3tIICXCpStOHd3EmtZFoVnffKcHZ5rAYFebHDkmk6",
)
# https://docs.djangoproject.com/en/dev/ref/settings/#allowed-hosts
ALLOWED_HOSTS = ["localhost", "0.0.0.0", "127.0.0.1"]

# CACHES
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#caches
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "",
    },
    "api": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "",
    }
}

# EMAIL
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#email-backend
EMAIL_BACKEND = env(
    "DJANGO_EMAIL_BACKEND",
    default="django.core.mail.backends.console.EmailBackend"
)

# WhiteNoise
# ------------------------------------------------------------------------------
# http://whitenoise.evans.io/en/latest/django.html#using-whitenoise-in-development
INSTALLED_APPS = ["whitenoise.runserver_nostatic"] + INSTALLED_APPS  # noqa F405

# django-debug-toolbar
# ------------------------------------------------------------------------------
# https://django-debug-toolbar.readthedocs.io/en/latest/installation.html#prerequisites
INSTALLED_APPS += ["debug_toolbar"]  # noqa F405
# https://django-debug-toolbar.readthedocs.io/en/latest/installation.html#middleware
MIDDLEWARE += ["debug_toolbar.middleware.DebugToolbarMiddleware"]  # noqa F405
# https://django-debug-toolbar.readthedocs.io/en/latest/configuration.html#debug-toolbar-config
DEBUG_TOOLBAR_CONFIG = {
    "DISABLE_PANELS": ["debug_toolbar.panels.redirects.RedirectsPanel"],
    "SHOW_TEMPLATE_CONTEXT": True,
}
# https://django-debug-toolbar.readthedocs.io/en/latest/installation.html#internal-ips
INTERNAL_IPS = ["127.0.0.1", "10.0.2.2"]
if env("USE_DOCKER") == "yes":
    import socket

    hostname, _, ips = socket.gethostbyname_ex(socket.gethostname())
    INTERNAL_IPS += [".".join(ip.split(".")[:-1] + ["1"]) for ip in ips]

# django-extensions
# ------------------------------------------------------------------------------
# https://django-extensions.readthedocs.io/en/latest/installation_instructions.html#configuration
INSTALLED_APPS += ["django_extensions"]  # noqa F405
# Celery
# ------------------------------------------------------------------------------

# http://docs.celeryproject.org/en/latest/userguide/configuration.html#task-eager-propagates
CELERY_TASK_EAGER_PROPAGATES = True

# Your stuff...
# ------------------------------------------------------------------------------

# rdmo
# ------------------------------------------------------------------------------
# TODO: keep in mind that all rdmo settings are imported above: from rdmo.core.settings import *

# set path-dependend settings
PROJECT_DIR = ROOT_DIR
BASE_DIR = os.path.dirname(PROJECT_DIR)
# TODO: better add app specific templates as usual for django, recommended by rdmo developers
THEME_DIR = os.path.join(ROOT_DIR, 'theme')
VENDOR_CDN = False
# update STATICFILES_DIRS for the vendor directory
STATICFILES_DIRS += [
    os.path.join(ROOT_DIR, 'vendor/')
]

CSRF_COOKIE_HTTPONLY = False

# add static and templates from local.THEME_DIR to STATICFILES_DIRS and TEMPLATES
try:
    STATICFILES_DIRS.append(os.path.join(THEME_DIR, 'static/'))
    TEMPLATES[0]['DIRS'].append(os.path.join(THEME_DIR, 'templates/'))
except NameError:
    pass

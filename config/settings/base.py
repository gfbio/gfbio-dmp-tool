"""
Base settings to build other settings files upon.
"""

import os
from pathlib import Path

import environ
from django.utils.translation import gettext_lazy as _

# import default settings from rdmo
from rdmo.core.settings import *

ROOT_DIR = Path(__file__).resolve(strict=True).parent.parent.parent
# gfbio_dmpt/
APPS_DIR = ROOT_DIR / "gfbio_dmpt"
env = environ.Env()

READ_DOT_ENV_FILE = env.bool("DJANGO_READ_DOT_ENV_FILE", default=False)
if READ_DOT_ENV_FILE:
    # OS environment variables take precedence over variables from .env
    env.read_env(str(ROOT_DIR / ".env"))

# GENERAL
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#debug
DEBUG = env.bool("DJANGO_DEBUG", False)
# Local time zone. Choices are
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# though not all of them may be available with every OS.
# In Windows, this must be set to your system time zone.
TIME_ZONE = "UTC"
# https://docs.djangoproject.com/en/dev/ref/settings/#language-code
LANGUAGE_CODE = "en-us"
# https://docs.djangoproject.com/en/dev/ref/settings/#site-id
SITE_ID = env("DJANGO_SITE_ID", default=2)
# https://docs.djangoproject.com/en/dev/ref/settings/#use-i18n
USE_I18N = True
# https://docs.djangoproject.com/en/dev/ref/settings/#use-l10n
USE_L10N = True
# https://docs.djangoproject.com/en/dev/ref/settings/#use-tz
USE_TZ = True
# https://docs.djangoproject.com/en/dev/ref/settings/#locale-paths
LOCALE_PATHS = [str(ROOT_DIR / "locale")]

# DATABASES
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#databases
DATABASES = {"default": env.db("DATABASE_URL")}
DATABASES["default"]["ATOMIC_REQUESTS"] = True

# URLS
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#root-urlconf
ROOT_URLCONF = "config.urls"
# https://docs.djangoproject.com/en/dev/ref/settings/#wsgi-application
WSGI_APPLICATION = "config.wsgi.application"

# APPS
# ------------------------------------------------------------------------------
DJANGO_APPS = [
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.sites",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # "django.contrib.humanize", # Handy template tags
    "django.contrib.admin",
    "django.forms",
]
THIRD_PARTY_APPS = [
    "crispy_forms",
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "django_celery_beat",
    "rest_framework",
    "rest_framework.authtoken",
    "widget_tweaks",
    "markdown",
    "django_cleanup",
    "django_filters",
    "mathfilters",
    "mptt",
    "rules",
    # openapi specification tools
    "rest_framework_swagger",
]

RDMO_CORE_APPS = [
    # rdmo modules
    "rdmo",
    "rdmo.core",
    "rdmo.accounts",
    "rdmo.services",
    "rdmo.domain",
    "rdmo.options",
    "rdmo.conditions",
    "rdmo.questions",
    "rdmo.tasks",
    "rdmo.views",
    "rdmo.projects",
    "rdmo.management",
    "rdmo.overlays",
]

LOCAL_APPS = [
    # because of rdmo this is not set in AUTH_USER_MODEL, but we keep it here for now
    "gfbio_dmpt.users.apps.UsersConfig",
    # Your stuff: custom apps go here
    "gfbio_dmpt.gfbio_dmpt_form.apps.GFBioDmptFormConfig",
    "gfbio_dmpt.basic_rdmo.apps.BasicRdmoConfig",
]
# https://docs.djangoproject.com/en/dev/ref/settings/#installed-apps
INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + RDMO_CORE_APPS + LOCAL_APPS

# MIGRATIONS
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#migration-modules
MIGRATION_MODULES = {"sites": "gfbio_dmpt.contrib.sites.migrations"}

# AUTHENTICATION
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#authentication-backends
AUTHENTICATION_BACKENDS = [
    "rules.permissions.ObjectPermissionBackend",
    "django.contrib.auth.backends.ModelBackend",
    "allauth.account.auth_backends.AuthenticationBackend",
    #  "mozilla_django_oidc.auth.OIDCAuthenticationBackend",
    "gfbio_dmpt.authentication.auth_backends.GFBioAuthenticationBackend",
]
# https://docs.djangoproject.com/en/dev/ref/settings/#auth-user-model
# because of rdmo
AUTH_USER_MODEL = "users.User"

# https://docs.djangoproject.com/en/dev/ref/settings/#login-redirect-url

# NOTE: dynamic redirect seem to break the gwdg sso login.
#  LOGIN_REDIRECT_URL = "users:redirect"
LOGIN_REDIRECT_URL = "/"
LOGOUT_REDIRECT_URL = "/"
# https://docs.djangoproject.com/en/dev/ref/settings/#login-url
LOGIN_URL = "account_login"

# PASSWORDS
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#password-hashers
PASSWORD_HASHERS = [
    # https://docs.djangoproject.com/en/dev/topics/auth/passwords/#using-argon2-with-django
    "django.contrib.auth.hashers.Argon2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher",
    "django.contrib.auth.hashers.BCryptSHA256PasswordHasher",
]
# https://docs.djangoproject.com/en/dev/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"
    },
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# MIDDLEWARE
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#middleware
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.common.BrokenLinkEmailsMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# STATIC
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#static-root
STATIC_ROOT = str(ROOT_DIR / "staticfiles")
# https://docs.djangoproject.com/en/dev/ref/settings/#static-url
STATIC_URL = "/static/"
# https://docs.djangoproject.com/en/dev/ref/contrib/staticfiles/#std:setting-STATICFILES_DIRS
STATICFILES_DIRS = [str(APPS_DIR / "static")]
# https://docs.djangoproject.com/en/dev/ref/contrib/staticfiles/#staticfiles-finders
STATICFILES_FINDERS = [
    "django.contrib.staticfiles.finders.FileSystemFinder",
    "django.contrib.staticfiles.finders.AppDirectoriesFinder",
    # other finders..
]

# MEDIA
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#media-root
MEDIA_ROOT = str(APPS_DIR / "media")
# https://docs.djangoproject.com/en/dev/ref/settings/#media-url
MEDIA_URL = "/media/"

# TEMPLATES
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#templates
TEMPLATES = [
    {
        # https://docs.djangoproject.com/en/dev/ref/settings/#std:setting-TEMPLATES-BACKEND
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        # https://docs.djangoproject.com/en/dev/ref/settings/#template-dirs
        "DIRS": [str(APPS_DIR / "templates")],
        "OPTIONS": {
            # https://docs.djangoproject.com/en/dev/ref/settings/#template-loaders
            # https://docs.djangoproject.com/en/dev/ref/templates/api/#loader-types
            "loaders": [
                "django.template.loaders.filesystem.Loader",
                "django.template.loaders.app_directories.Loader",
            ],
            # https://docs.djangoproject.com/en/dev/ref/settings/#template-context-processors
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.template.context_processors.i18n",
                "django.template.context_processors.media",
                "django.template.context_processors.static",
                "django.template.context_processors.tz",
                "django.contrib.messages.context_processors.messages",
                "gfbio_dmpt.utils.context_processors.settings_context",
                "gfbio_dmpt.utils.context_processors.prod_env",
            ],
            "libraries": {
                "staticfiles": "django.templatetags.static",
            },
        },
    }
]

# https://docs.djangoproject.com/en/dev/ref/settings/#form-renderer
FORM_RENDERER = "django.forms.renderers.TemplatesSetting"

# http://django-crispy-forms.readthedocs.io/en/latest/install.html#template-packs
CRISPY_TEMPLATE_PACK = "bootstrap4"

# FIXTURES
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#fixture-dirs
FIXTURE_DIRS = (str(APPS_DIR / "fixtures"),)

# SECURITY
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#session-cookie-httponly
SESSION_COOKIE_HTTPONLY = True
# https://docs.djangoproject.com/en/dev/ref/settings/#csrf-cookie-httponly
CSRF_COOKIE_HTTPONLY = True
# https://docs.djangoproject.com/en/dev/ref/settings/#secure-browser-xss-filter
SECURE_BROWSER_XSS_FILTER = True
# https://docs.djangoproject.com/en/dev/ref/settings/#x-frame-options
X_FRAME_OPTIONS = "DENY"

# EMAIL
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#email-backend
EMAIL_BACKEND = env(
    "DJANGO_EMAIL_BACKEND",
    default="django.core.mail.backends.smtp.EmailBackend",
)
# https://docs.djangoproject.com/en/dev/ref/settings/#email-timeout
EMAIL_TIMEOUT = 5

# ADMIN
# ------------------------------------------------------------------------------
# Django Admin URL.
ADMIN_URL = "admin/"
# https://docs.djangoproject.com/en/dev/ref/settings/#admins
ADMINS = [("""Marc Weber""", "mweber@gfbio.org")]
# https://docs.djangoproject.com/en/dev/ref/settings/#managers
MANAGERS = ADMINS

# LOGGING
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#logging
# See https://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "%(levelname)s %(asctime)s %(module)s "
            "%(process)d %(thread)d %(message)s"
        }
    },
    "handlers": {
        "console": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        }
    },
    "root": {"level": "INFO", "handlers": ["console"]},
}

# Celery
# ------------------------------------------------------------------------------
if USE_TZ:
    # http://docs.celeryproject.org/en/latest/userguide/configuration.html#std:setting-timezone
    CELERY_TIMEZONE = TIME_ZONE
# http://docs.celeryproject.org/en/latest/userguide/configuration.html#std:setting-broker_url
CELERY_BROKER_URL = env("CELERY_BROKER_URL")
# http://docs.celeryproject.org/en/latest/userguide/configuration.html#std:setting-result_backend
CELERY_RESULT_BACKEND = CELERY_BROKER_URL
# http://docs.celeryproject.org/en/latest/userguide/configuration.html#std:setting-accept_content
CELERY_ACCEPT_CONTENT = ["json"]
# http://docs.celeryproject.org/en/latest/userguide/configuration.html#std:setting-task_serializer
CELERY_TASK_SERIALIZER = "json"
# http://docs.celeryproject.org/en/latest/userguide/configuration.html#std:setting-result_serializer
CELERY_RESULT_SERIALIZER = "json"
# http://docs.celeryproject.org/en/latest/userguide/configuration.html#task-time-limit
# TODO: set to whatever value is adequate in your circumstances
CELERY_TASK_TIME_LIMIT = 5 * 60
# http://docs.celeryproject.org/en/latest/userguide/configuration.html#task-soft-time-limit
# TODO: set to whatever value is adequate in your circumstances
CELERY_TASK_SOFT_TIME_LIMIT = 60
# http://docs.celeryproject.org/en/latest/userguide/configuration.html#beat-scheduler
CELERY_BEAT_SCHEDULER = "django_celery_beat.schedulers:DatabaseScheduler"

# django-allauth
# ------------------------------------------------------------------------------
ACCOUNT_ALLOW_REGISTRATION = env.bool("DJANGO_ACCOUNT_ALLOW_REGISTRATION", True)
# https://django-allauth.readthedocs.io/en/latest/configuration.html
ACCOUNT_AUTHENTICATION_METHOD = "username"
# https://django-allauth.readthedocs.io/en/latest/configuration.html
ACCOUNT_EMAIL_REQUIRED = True
# https://django-allauth.readthedocs.io/en/latest/configuration.html
ACCOUNT_EMAIL_VERIFICATION = "mandatory"
# https://django-allauth.readthedocs.io/en/latest/configuration.html
ACCOUNT_ADAPTER = "gfbio_dmpt.users.adapters.AccountAdapter"
# https://django-allauth.readthedocs.io/en/latest/configuration.html
SOCIALACCOUNT_ADAPTER = "gfbio_dmpt.users.adapters.SocialAccountAdapter"

# django-compressor
# ------------------------------------------------------------------------------
# https://django-compressor.readthedocs.io/en/latest/quickstart/#installation
INSTALLED_APPS += ["compressor"]
STATICFILES_FINDERS += ["compressor.finders.CompressorFinder"]

# django-rest-framework
# -------------------------------------------------------------------------------
# django-rest-framework - https://www.django-rest-framework.org/api-guide/settings/
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.TokenAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
    "DEFAULT_SCHEMA_CLASS": "rest_framework.schemas.coreapi.AutoSchema",
}

# django-cors-headers - https://github.com/adamchainz/django-cors-headers#setup
CORS_URLS_REGEX = r"^/api/.*$"

# Your stuff...
# ------------------------------------------------------------------------------

# gfbio SSO
# ------------------------------------------------------------------------------
ANONYMOUS_PASS = env("ANONYMOUS_PASS")

# gfbio SSO
# ------------------------------------------------------------------------------
OIDC_RP_CLIENT_ID = env("OIDC_RP_CLIENT_ID", default="no_oidc_cl_id")
OIDC_RP_CLIENT_SECRET = env("OIDC_RP_CLIENT_SECRET", default="no_oidc_cl_secret")
OIDC_RP_SIGN_ALGO = env("OIDC_RP_SIGN_ALGO", default="HS256")
OIDC_OP_JWKS_ENDPOINT = env("OIDC_OP_JWKS_ENDPOINT", default="no_jwks_url")
OIDC_OP_AUTHORIZATION_ENDPOINT = (
    "https://keycloak.sso.gwdg.de/auth/realms/GFBio/protocol/openid-connect/auth"
)
OIDC_OP_TOKEN_ENDPOINT = (
    "https://keycloak.sso.gwdg.de/auth/realms/GFBio/protocol/openid-connect/token"
)
OIDC_OP_USER_ENDPOINT = (
    "https://keycloak.sso.gwdg.de/auth/realms/GFBio/protocol/openid-connect/userinfo"
)

# rdmo
# ------------------------------------------------------------------------------
# TODO: keep in mind that all rdmo settings are imported above: from rdmo.core.settings import *

# set path-dependend settings
PROJECT_DIR = ROOT_DIR
BASE_DIR = os.path.dirname(PROJECT_DIR)
# TODO: better add app specific templates as usual for django, recommended by rdmo developers
# THEME_DIR = os.path.join(ROOT_DIR, 'theme')
VENDOR_CDN = True
# update STATICFILES_DIRS for the vendor directory
# STATICFILES_DIRS += [
#     os.path.join(ROOT_DIR, 'vendor/')
# ]

CSRF_COOKIE_HTTPONLY = False

USER_API = True

OVERLAYS = {
    "projects": ["projects-table", "create-project", "import-project"],
    "project": [
        "project-questions",
        "project-catalog",
        "project-issues",
        "project-views",
        "project-memberships",
        "project-snapshots",
        "export-project",
        "import-project",
    ],
    "issue_send": ["issue-message", "issue-attachments"],
}

EXPORT_FORMATS = (
    ("pdf", _("PDF")),
    ("rtf", _("Rich Text Format")),
    ("odt", _("Open Office")),
    ("docx", _("Microsoft Office")),
    ("html", _("HTML")),
    ("markdown", _("Markdown")),
    ("mediawiki", _("mediawiki")),
    ("tex", _("LaTeX")),
)

EXPORT_REFERENCE_ODT_VIEWS = {}
EXPORT_REFERENCE_DOCX_VIEWS = {}
EXPORT_REFERENCE_ODT = None
EXPORT_REFERENCE_DOCX = None

EXPORT_PANDOC_ARGS = {
    "pdf": ["-V", "geometry:margin=1in", "--pdf-engine=xelatex"],
    "rtf": ["--standalone"],
}

PROJECT_ISSUES = True

PROJECT_VIEWS = True

PROJECT_EXPORTS = [
    ("xml", _("RDMO XML"), "rdmo.projects.exports.RDMOXMLExport"),
    ("csvcomma", _("CSV comma separated"), "rdmo.projects.exports.CSVCommaExport"),
    (
        "csvsemicolon",
        _("CSV semicolon separated"),
        "rdmo.projects.exports.CSVSemicolonExport",
    ),
]

PROJECT_IMPORTS = [
    ("xml", _("RDMO XML"), "rdmo.projects.imports.RDMOXMLImport"),
]

PROJECT_QUESTIONS_AUTOSAVE = False

PROJECT_FILE_QUOTA = "10Mb"

PROJECT_SEND_ISSUE = False

PROJECT_INVITE_TIMEOUT = None

PROJECT_SEND_INVITE = True

NESTED_PROJECTS = True

SERVICE_PROVIDERS = []

OPTIONSET_PROVIDERS = []

QUESTIONS_WIDGETS = [
    ("text", _("Text"), "rdmo.projects.widgets.TextWidget"),
    ("textarea", _("Textarea"), "rdmo.projects.widgets.TextareaWidget"),
    ("yesno", _("Yes/No"), "rdmo.projects.widgets.YesnoWidget"),
    ("checkbox", _("Checkboxes"), "rdmo.projects.widgets.CheckboxWidget"),
    ("radio", _("Radio buttons"), "rdmo.projects.widgets.RadioWidget"),
    ("select", _("Select drop-down"), "rdmo.projects.widgets.SelectWidget"),
    ("autocomplete", _("Autocomplete"), "rdmo.projects.widgets.AutocompleteWidget"),
    ("range", _("Range slider"), "rdmo.projects.widgets.RangeWidget"),
    ("date", _("Date picker"), "rdmo.projects.widgets.DateWidget"),
    ("file", _("File upload"), "rdmo.projects.widgets.FileWidget"),
]

DEFAULT_URI_PREFIX = "http://example.com/terms"

VENDOR_CDN = True

VENDOR = {
    "jquery": {
        "url": "https://code.jquery.com/",
        "js": [
            {
                "path": "jquery-3.4.1.min.js",
                "sri": "sha384-vk5WoKIaW/vJyUAd9n/wmopsmNhiy+L2Z+SBxGYnUkunIxVxAv/UtMOhba/xskxh",
            }
        ],
    },
    "bootstrap": {
        "url": "https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/",
        "js": [
            {
                "path": "js/bootstrap.min.js",
                "sri": "sha384-aJ21OjlMXNL5UyIl/XNwTMqvzeRMZH2w8c5cRVpzpU8Y5bApTppSuUkhZXN0VxHd",
            }
        ],
        "css": [
            {
                "path": "css/bootstrap.min.css",
                "sri": "sha384-HSMxcRTRxnN+Bdg0JdbxYKrThecOKuH5zCYotlSAcp1+c8xmyTe9GYg1l9a69psu",
            }
        ],
    },
    "bootstrap-datepicker": {
        "url": "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.7.1/",
        "css": [{"path": "css/bootstrap-datepicker.min.css"}],
        "js": [{"path": "js/bootstrap-datepicker.min.js"}],
    },
    "font-awesome": {
        "url": "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/",
        "css": [{"path": "css/font-awesome.min.css"}],
        "font": [
            {"path": "fonts/fontawesome-webfont.eot"},
            {"path": "fonts/fontawesome-webfont.woff2"},
            {"path": "fonts/fontawesome-webfont.woff"},
            {"path": "fonts/fontawesome-webfont.ttf"},
            {"path": "fonts/fontawesome-webfont.svg"},
        ],
    },
    "angular": {
        "url": "https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/",
        "js": [{"path": "angular.min.js"}, {"path": "angular-resource.min.js"}],
    },
    "select2": {
        "url": "https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/",
        "js": [
            {
                "path": "js/select2.min.js",
                "sri": "sha256-HNkbndPiWM5EIRgahc3hWiuGD6CtwFgMfEU0o3zeabo=",
            }
        ],
        "css": [
            {
                "path": "css/select2.min.css",
                "sri": "sha256-EQA4j7+ZbrewCQvwJzNmVxiKMwGRspXMGgt7I6AAiqs=",
            }
        ],
    },
    "select2-bootstrap-theme": {
        "url": "https://cdnjs.cloudflare.com/ajax/libs/select2-bootstrap-theme/0.1.0-beta.10/",
        "css": [
            {
                "path": "select2-bootstrap.min.css",
                "sri": "sha256-nbyata2PJRjImhByQzik2ot6gSHSU4Cqdz5bNYL2zcU=",
            }
        ],
    },
    "moment": {
        "url": "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/",
        "js": [
            {
                "path": "moment.min.js",
                "sri": "sha256-1hjUhpc44NwiNg8OwMu2QzJXhD8kcj+sJA3aCQZoUjg=",
            }
        ],
    },
    "codemirror": {
        "url": "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.29.0/",
        "js": [
            {
                "path": "codemirror.min.js",
                "sri": "sha256-0LRLvWWVXwt0eH0/Bzd0PHICg/bSMDIe5sXgaDSpZaA=",
            },
            {
                "path": "addon/mode/overlay.min.js",
                "sri": "sha256-ffWkw3Pn4ieMygm1vwdRKcMtBJ6E6kuBi8GlVVPXWEs=",
            },
            {
                "path": "mode/django/django.min.js",
                "sri": "sha256-6hO1TjC+3W73p+kXnCqcHVjfRa4KMdG7hvWencnu0XM=",
            },
        ],
        "css": [
            {
                "path": "codemirror.min.css",
                "sri": "sha256-wluO/w4cnorJpS0JmcdTSYzwdb5E6u045qa4Ervfb1k=",
            }
        ],
    },
    "fuse": {
        "url": "https://cdnjs.cloudflare.com/ajax/libs/fuse.js/3.4.6/",
        "js": [
            {
                "path": "fuse.min.js",
                "sri": "sha512-FwWaT/y9ajd/+J06KL9Fko1jELonJNHMUTR4nGP9MSIq4ZdU2w9/OiLxn16p/zEOZkryHi3wKYsnWPuADD328Q==",
            }
        ],
    },
}

# necessary since django 3.2, explicitly set primary key type to avaoid warnings
DEFAULT_AUTO_FIELD = "django.db.models.AutoField"
ACCOUNT = True
ACCOUNT_SIGNUP = True
ACCOUNT_TERMS_OF_USE = False
SOCIALACCOUNT = False

EMAIL_RECIPIENTS_CHOICES = [
    ("email@example.com", "Emmi Email <email@example.com>"),
]
EMAIL_RECIPIENTS_INPUT = True

SERVICE_PROVIDERS = [("github", _("GitHub"), "rdmo.services.providers.GitHubProvider")]
SHIBBOLETH = False
SHIBBOLETH_LOGOUT_URL = "/Shibboleth.sso/Logout"
LANGUAGES = (
    ("en", _("English")),
    ("de", _("German")),
)

LOGIN_URL = "/accounts/login/"
LOGIN_REDIRECT_URL = "/"
LOGOUT_URL = "/accounts/logout/"

MULTISITE = False
PROFILE_UPDATE = True
PROFILE_DELETE = True

SETTINGS_EXPORT = [
    "LOGIN_URL",
    "LOGOUT_URL",
    "ACCOUNT",
    "ACCOUNT_SIGNUP",
    "ACCOUNT_TERMS_OF_USE",
    "SOCIALACCOUNT",
    "PROFILE_UPDATE",
    "PROFILE_DELETE",
    "SHIBBOLETH",
    "MULTISITE",
    "EXPORT_FORMATS",
    "PROJECT_ISSUES",
    "PROJECT_VIEWS",
    "PROJECT_EXPORTS",
    "PROJECT_IMPORTS",
    "PROJECT_SEND_ISSUE",
    "PROJECT_QUESTIONS_AUTOSAVE",
    "NESTED_PROJECTS",
    "SITE_ID",
]

# GFBio Helpdesk Shadow-Account Service
# ------------------------------------------------------------------------------
JIRA_ACCOUNT_SERVICE_USER = env(
    "JIRA_ACCOUNT_SERVICE_USER", default="no_account_service_user"
)
JIRA_ACCOUNT_SERVICE_PASSWORD = env(
    "JIRA_ACCOUNT_SERVICE_PASSWORD", default="no_account_service_password"
)

# jira integration
JIRA_URL = env("JIRA_URL", default="https://helpdesk.gfbio.org")
JIRA_PROJECT = env("JIRA_ENV", default="SAND")
JIRA_USERNAME = env("JIRA_USERNAME")
JIRA_PASS = env("JIRA_PASS")
JIRA_DEFAULT_REPORTER_EMAIL = env("JIRA_DEFAULT_REPORTER_EMAIL")

# production environment check for Google Analytics
IS_PROD_ENV = env.bool("IS_PROD_ENV", False)

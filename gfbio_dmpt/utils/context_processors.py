from django.conf import settings


def settings_context(_request):
    """Settings available by default to the templates context."""
    # Note: we intentionally do NOT expose the entire settings
    # to prevent accidental leaking of sensitive information
    return {"DEBUG": settings.DEBUG}


def prod_env(_request):
    return {"prod_env": settings.IS_PROD_ENV}

def matomo_settings(_request):
    """
    Adds the Matomo Site ID to the template context.
    Returns None if no Site ID is defined.
    """
    return {
        "MATOMO_SITE_ID": getattr(settings, "MATOMO_SITE_ID", None),
    }

# -*- coding: utf-8 -*-
from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class GFBioDmptFormConfig(AppConfig):
    name = "gfbio_dmpt.gfbio_dmpt_form"
    verbose_name = _("GFBioDmptForms")

    def ready(self):
        try:
            import gfbio_dmpt.gfbio_dmpt_form.signals  # noqa F401
        except ImportError:
            pass

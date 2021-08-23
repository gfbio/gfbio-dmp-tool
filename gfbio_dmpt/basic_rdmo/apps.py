# -*- coding: utf-8 -*-
from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class BasicRdmoConfig(AppConfig):
    name = "gfbio_dmpt.basic_rdmo"
    verbose_name = _("BasicRdmo")

    def ready(self):
        try:
            import gfbio_dmpt.basic_rdmo.signals  # noqa F401
        except ImportError:
            pass

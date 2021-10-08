# -*- coding: utf-8 -*-
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic import TemplateView
from rdmo.core.utils import render_to_format
from rdmo.projects.models import Project
from rdmo.projects.views import ProjectAnswersView


class CSRFViewMixin(View):

    @method_decorator(ensure_csrf_cookie)
    def get(self, request, *args, **kwargs):
        return super().get(self, request, *args, **kwargs)


# React App in this template
class DmptFrontendView(CSRFViewMixin, TemplateView):
    template_name = 'gfbio_dmpt_form/dmpt.html'


# React App in this template
class DmptFrontendView(TemplateView):
    template_name = 'gfbio_dmpt_form/dmpt.html'


# This exports a GFBio branded DMP PDF
class DmpExportView(ProjectAnswersView):
    model = Project
    template_name = "gfbio_dmpt_export/dmp_export.html"

    def render_to_response(self, context, **response_kwargs):
        return render_to_format(self.request, self.kwargs['format'], 'dmp_export', 'gfbio_dmpt_export/dmp_export.html', context)

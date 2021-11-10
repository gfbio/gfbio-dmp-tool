# -*- coding: utf-8 -*-
from django.contrib.auth.models import Group
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic import TemplateView
from rdmo.projects.models import Project
from rdmo.projects.views import ProjectAnswersView
from rest_framework.authtoken.models import Token

from config.settings.base import ANONYMOUS_PASS
from gfbio_dmpt.users.models import User
from gfbio_dmpt.utils.dmp_export import render_to_format


class CSRFViewMixin(View):

    @method_decorator(ensure_csrf_cookie)
    def get(self, request, *args, **kwargs):
        return super().get(self, request, *args, **kwargs)


# class DmptProjectsView(mixins.ListModelMixin,):
#     queryset = rdmo.projects.models.Project.objects.all()
#     authentication_classes = (TokenAuthentication, BasicAuthentication)
#     permission_classes = (permissions.IsAuthenticated,)
#                           # IsOwnerOrReadOnly)

# DMP React App in this template
class DmptFrontendView(CSRFViewMixin, TemplateView):
    template_name = 'gfbio_dmpt_form/dmpt.html'

    def get(self, request, *args, **kwargs):
        user = self.request.user
        if not request.user.is_authenticated:
            # TODO: annonymous need to be/have permission:
            #   (rdmo) group: api
            user, created = User.objects.get_or_create(
                username='anonymous',
                defaults={
                    'username': 'anonymous',
                    'password': ANONYMOUS_PASS
                })
            api_group = Group.objects.get(name='api')
            api_group.user_set.add(user)
        token, created = Token.objects.get_or_create(user_id=user.id)

        context = self.get_context_data(**kwargs)
        context['backend'] = {
            'isLoggedIn': '{}'.format(request.user.is_authenticated).lower(),
            'token': str(token),
        }
        return self.render_to_response(context)


# This exports a GFBio branded DMP PDF
class DmpExportView(ProjectAnswersView):
    model = Project
    template_name = "gfbio_dmpt_export/dmp_export.html"

    def render_to_response(self, context, **response_kwargs):
        return render_to_format(self.request, self.kwargs['format'],
                                'dmp_export',
                                'gfbio_dmpt_export/dmp_export.html', context)

# -*- coding: utf-8 -*-

# from django.http import HttpResponseRedirect
# from django.shortcuts import render

from django.views.generic.edit import FormView

from .forms import GFBioDmptForm


# def dmpt_form_view(request):
#     if request.method == 'POST':
#         form = GFBioDmptForm(request.POST)
#         if form.is_valid():
#             return HttpResponseRedirect('/thanks/')
#
#     else:
#         form = GFBioDmptForm()
#
#     return render(request, 'gfbio_dmpt_form/dmpt_form.html', {'form': form})


class DmptFormView(FormView):
    template_name = 'gfbio_dmpt_form/dmpt_form.html'
    form_class = GFBioDmptForm
    success_url = '/thanks/'

    # TODO: new tmp project on blank form
    # TODO: check for existing temp project
    # TODO: delete old temp projects
    def get(self, request, *args, **kwargs):
        print('CUSTOM_GET')
        return super().get(self, request, *args, **kwargs)

    def form_valid(self, form):
        # This method is called when valid form data has been POSTed.
        # It should return an HttpResponse.

        # form.send_email()
        return super().form_valid(form)

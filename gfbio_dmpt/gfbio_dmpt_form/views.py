# -*- coding: utf-8 -*-

from django.http import HttpResponseRedirect
from django.shortcuts import render

from .forms import GFBioDmptForm


def dmpt_form_view(request):
    if request.method == 'POST':
        form = GFBioDmptForm(request.POST)
        if form.is_valid():
            return HttpResponseRedirect('/thanks/')

    else:
        form = GFBioDmptForm()

    return render(request, 'gfbio_dmpt_form/dmpt_form.html', {'form': form})

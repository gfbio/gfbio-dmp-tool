# -*- coding: utf-8 -*-
from django.core.management import CommandError
from django.core.management.base import BaseCommand
from rdmo.questions.models import Catalog

from gfbio_dmpt.gfbio_dmpt_form.models import DmptProject


class Command(BaseCommand):
    help = ('When an existing dmp-system has been updated from rdmo 1 to rdmo 2, there is a chance that the'
            ' update will remove the link from projects to a catalog. When executing this command, all projects '
            'that lack an associated catalog, will get the catalog with "catalog_id" assigned.'
            ' This process is only applied for projects created via GFBio DMP and an owner that is not "anonymous"')

    def add_arguments(self, parser):
        parser.add_argument('catalog_id', type=int)

    def set_catalog(self, catalog_ids, catalog_obj, dmpt_projects):
        print('\t--- check and process ', len(dmpt_projects), ' dmpt projects')
        counter = 0
        for dmpt_project in dmpt_projects:
            if dmpt_project.rdmo_project.catalog is None or dmpt_project.rdmo_project.catalog.id not in catalog_ids:
                print('\t--- set catalog for ', dmpt_project.rdmo_project.title)
                dmpt_project.rdmo_project.catalog = catalog_obj
                dmpt_project.rdmo_project.save()
                dmpt_project.save()
                counter += 1
        print('\t--- modified ', counter, ' dmpt projects')

    def handle(self, *args, **kwargs):
        catalog = Catalog.objects.filter(id=kwargs['catalog_id'])
        if len(catalog) == 1:
            catalog_obj = catalog.first()
            catalog_ids = Catalog.objects.all().values_list('id', flat=True)
            dmpt_projects = DmptProject.objects.exclude(user__username__startswith='anonymous')
            self.set_catalog(catalog_ids, catalog_obj, dmpt_projects)


        else:
            raise CommandError('no catalog could be found for "catalog_id" ', kwargs['catalog_id'])

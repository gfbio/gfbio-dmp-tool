# -*- coding: utf-8 -*-
from rdmo.projects.models import Project
from rest_framework import serializers

from config.settings.base import AUTH_USER_MODEL
from gfbio_dmpt.gfbio_dmpt_form.models import DmptProject


class UserSerializer(serializers.ModelSerializer):
    dmpt_project = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=DmptProject.objects.all()
    )

    class Meta:
        model = AUTH_USER_MODEL
        fields = ('id', 'username', 'rdmo_project',)


class DmptProjectSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()

    class Meta:
        model = DmptProject
        fields = ['id', 'user', 'rdmo_project', 'title']

    def get_title(self, obj):
        return obj.rdmo_project.title


class RdmoProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'title', 'catalog']

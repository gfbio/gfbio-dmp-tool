# -*- coding: utf-8 -*-
from django.core.exceptions import ObjectDoesNotExist
from rdmo.projects.models import Project
from rdmo.questions.models import Catalog
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
    issue = serializers.SerializerMethodField()

    class Meta:
        model = DmptProject
        fields = ['id', 'user', 'rdmo_project', 'title', 'issue']

    def get_title(self, obj):
        return obj.rdmo_project.title

    def get_issue(self, obj):
        try:
            return obj.issue.issue_key
        except ObjectDoesNotExist as e:
            return ''


class RdmoProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'title', 'catalog']


class RdmoProjectValuesSerializer(serializers.Serializer):
    catalog = serializers.IntegerField(required=True)
    title = serializers.CharField(required=True)
    form_data = serializers.JSONField(required=True)

    class Meta:
        fields = ['title', 'catalog', 'form_data']

    def validate(self, data):
        catalogs = Catalog.objects.filter(id=data.get('catalog', None))
        if len(catalogs) != 1:
            raise serializers.ValidationError({'catalog': 'catalog not found for this id'})
        return data


class RdmoProjectValuesUpdateSerializer(serializers.Serializer):
    dmpt_project = serializers.IntegerField(required=True)
    title = serializers.CharField(required=True)
    form_data = serializers.JSONField(required=True)

    class Meta:
        fields = ['title', 'dmpt_project', 'form_data']

    def validate(self, data):
        dmpt_projects = DmptProject.objects.filter(id=data.get('dmpt_project', None))
        if len(dmpt_projects) != 1:
            raise serializers.ValidationError({'dmpt_project': 'no dmptproject found for this id'})
        return data

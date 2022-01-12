# -*- coding: utf-8 -*-

from rest_framework import serializers

from config.settings.base import AUTH_USER_MODEL
from .models import DmptProject

class UserSerializer(serializers.ModelSerializer):
    dmpt_project = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=DmptProject.objects.all()
    )

    class Meta:
        model = AUTH_USER_MODEL
        fields = ('id', 'username', 'rdmo_project')


class DmptProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = DmptProject
        fields = ['user', 'rdmo_project']

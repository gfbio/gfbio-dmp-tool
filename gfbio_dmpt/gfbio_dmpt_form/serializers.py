# -*- coding: utf-8 -*-

from rest_framework import serializers

from .models import DmptProject


class DmptProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = DmptProject

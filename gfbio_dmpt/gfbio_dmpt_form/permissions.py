# -*- coding: utf-8 -*-
import logging

from rest_framework import permissions

logger = logging.getLogger(__name__)


class IsOwner(permissions.BasePermission):

    # def has_permission(self, request, view):

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        # if request.method in permissions.SAFE_METHODS:
        #     return True

        # Write permissions are only allowed to the owner.
        return obj.user == request.user

from django.db import models
from django.utils.translation import ugettext_lazy as _
from gfbio_dmpt.generic.fields import AutoCreatedField, AutoLastModifiedField

class TimeStampedModel(models.Model):
    """
    An abstract base class model that provides self-updating
    ``created`` and ``modified`` fields.

    """

    created = AutoCreatedField(_("created"))
    modified = AutoLastModifiedField(_("modified"))

    def save(self, *args, **kwargs):
        """
        Overriding the save method in order to make sure that
        modified field is updated even if it is not given as
        a parameter to the update field argument.
        """
        update_fields = kwargs.get("update_fields", None)
        if update_fields:
            kwargs["update_fields"] = set(update_fields).union({"modified"})

        super().save(*args, **kwargs)

    class Meta:
        abstract = True

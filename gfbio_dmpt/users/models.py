from model_utils.models import TimeStampedModel
from django.contrib.auth.models import AbstractUser
from django.db.models import CharField, AutoCreatedField, AutoLastModifiedField
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django import models
from django.db import IntegrityError


class TimeStampedModel(models.Model):
    """
    An abstract base class model that provides self-updating
    ``created`` and ``modified`` fields.

    """
    created = AutoCreatedField(_('created'))
    modified = AutoLastModifiedField(_('modified'))

    def save(self, *args, **kwargs):
        """
        Overriding the save method in order to make sure that
        modified field is updated even if it is not given as
        a parameter to the update field argument.
        """
        update_fields = kwargs.get('update_fields', None)
        if update_fields:
            kwargs['update_fields'] = set(update_fields).union({'modified'})

        super().save(*args, **kwargs)

    class Meta:
        abstract = True


class User(AbstractUser):
    """Default user for GFBio DMPT."""

    #: First and last name do not cover name patterns around the globe
    name = CharField(_("Name of User"), blank=True, max_length=255)
    # first_name = None  # type: ignore
    # last_name = None  # type: ignore

    def get_absolute_url(self):
        """Get url for user's detail view.

        Returns:
            str: URL for user detail.

        """
        return reverse("users:detail", kwargs={"username": self.username})


    def update_or_create_external_user_id(self, external_id, provider,
                                          resolver_url=''):
        default_vals = {
            'external_id': external_id,
            'provider': provider,
        }
        if len(resolver_url):
            default_vals['resolver_url'] = resolver_url
        try:
            return self.externaluserid_set.update_or_create(
                external_id=external_id,
                provider=provider,
                defaults=default_vals,
            )
        except IntegrityError as ie:
            return (None, False)


class ExternalUserId(TimeStampedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    external_id = CharField(
        null=False, blank=False, max_length=32,
        help_text=_('Not Required. 32 characters or fewer. Has to be unique '
                    'if not Null.'),
    )
    provider = CharField(
        max_length=32,
        help_text=_('Name of provider of this external id')
    )
    resolver_url = models.URLField(
        null=True, blank=True, max_length=64,
        help_text=_('An URL to resolve the value of "external_id"')
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['external_id', 'provider'],
                                    name='unique_id_for_provider'),
            models.UniqueConstraint(fields=['user', 'provider'],
                                    name='unique_id_for_user'),

        ]

    def __str__(self):
        return '{}_{}'.format(self.user.username, self.provider)

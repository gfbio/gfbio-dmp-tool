from django.contrib.auth.models import AbstractUser
from django.db import IntegrityError
from django.db import models
from django.db.models import CharField
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.db import models
from django.db import IntegrityError
from django.utils.timezone import now

from gfbio_dmpt.generic.models import TimeStampedModel

# FIXME: @cpfaff this resolves a very strange dependency in one of the fixtures. why import here ?
from gfbio_dmpt.generic.fields import AutoCreatedField, AutoLastModifiedField


class User(AbstractUser, TimeStampedModel):
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

    def update_or_create_external_user_id(self, external_id, provider, resolver_url=""):
        default_vals = {
            "external_id": external_id,
            "provider": provider,
        }
        if len(resolver_url):
            default_vals["resolver_url"] = resolver_url
        try:
            return self.externaluserid_set.update_or_create(
                external_id=external_id,
                provider=provider,
                defaults=default_vals,
            )
        except IntegrityError as ie:
            return (None, False)


# FIXME: @cpfaff this is not needed we have a lib installed for TimeStampedModel. remove this please
#   and add the proper TimeStampedModel
class ExternalUserId(TimeStampedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    external_id = CharField(
        null=False,
        blank=False,
        max_length=32,
        help_text=_(
            "Not Required. 32 characters or fewer. Has to be unique " "if not Null."
        ),
    )
    provider = CharField(
        max_length=32, help_text=_("Name of provider of this external id")
    )
    resolver_url = models.URLField(
        null=True,
        blank=True,
        max_length=64,
        help_text=_('An URL to resolve the value of "external_id"'),
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["external_id", "provider"], name="unique_id_for_provider"
            ),
            models.UniqueConstraint(
                fields=["user", "provider"], name="unique_id_for_user"
            ),
        ]

    def __str__(self):
        return "{}_{}".format(self.user.username, self.provider)

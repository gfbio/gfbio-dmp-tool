# Generated by Django 3.2.5 on 2021-10-20 07:32

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import gfbio_dmpt.users.models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_alter_user_first_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExternalUserId',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', gfbio_dmpt.users.models.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', gfbio_dmpt.users.models.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('external_id', models.CharField(help_text='Not Required. 32 characters or fewer. Has to be unique if not Null.', max_length=32)),
                ('provider', models.CharField(help_text='Name of provider of this external id', max_length=32)),
                ('resolver_url', models.URLField(blank=True, help_text='An URL to resolve the value of "external_id"', max_length=64, null=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddConstraint(
            model_name='externaluserid',
            constraint=models.UniqueConstraint(fields=('external_id', 'provider'), name='unique_id_for_provider'),
        ),
        migrations.AddConstraint(
            model_name='externaluserid',
            constraint=models.UniqueConstraint(fields=('user', 'provider'), name='unique_id_for_user'),
        ),
    ]

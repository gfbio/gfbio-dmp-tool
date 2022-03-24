# Generated by Django 3.2.5 on 2022-03-10 11:58

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0050_value_set_prefix'),
        ('gfbio_dmpt_form', '0002_alter_dmptproject_rdmo_project'),
    ]

    operations = [
        migrations.CreateModel(
            name='DmptIssue',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('issue_key', models.CharField(max_length=128)),
                ('dmpt_project', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='gfbio_dmpt_form.dmptproject')),
                ('rdmo_project', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='projects.project')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
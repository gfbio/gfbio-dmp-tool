# Generated by Django 3.2.5 on 2021-11-30 10:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0050_value_set_prefix'),
        ('jira_integration', '0003_rename_dmpjirastatus_ticket'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ticket',
            name='project',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='projects.project'),
        ),
    ]

# Generated by Django 3.2.5 on 2021-11-29 11:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('projects', '0050_value_set_prefix'),
    ]

    operations = [
        migrations.CreateModel(
            name='DmpJiraStatus',
            fields=[
                ('project_id', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='projects.project')),
                ('ticket_key', models.CharField(db_index=True, max_length=100)),
                ('ticket_id', models.CharField(db_index=True, max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
    ]
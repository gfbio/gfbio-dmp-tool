from django.contrib.auth import get_user_model
from config import celery_app
from django_celery_beat.models import CrontabSchedule, PeriodicTask
from celery.utils.log import get_task_logger
from datetime import datetime, timedelta

logger = get_task_logger(__name__)

schedule, _ = CrontabSchedule.objects.get_or_create(
    minute="*",
    hour="*",
    day_of_week="*",
    day_of_month="*",
    month_of_year="*",
)

PeriodicTask.objects.get_or_create(
    crontab=schedule,
    name="Delete anonymous users",
    task="gfbio_dmpt.users.tasks.delete_anonymous_users",
    defaults={"start_time": datetime.now()},
)

User = get_user_model()


# @celery_app.task(name="tasks.delete_anonymous_users")
@celery_app.task()
def delete_anonymous_users():
    logger.info("======================================================o")
    logger.info("Cleaning anonymous users created for dmpt download!")
    logger.info("======================================================o")
    anonymous = User.objects.filter(username__startswith="anonymous-").filter(
        created__gt=datetime.now() - timedelta(hours=24)
    )
    logger.info(anonymous)
    anonymous.delete()

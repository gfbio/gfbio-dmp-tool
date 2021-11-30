from django.db import models
from rdmo.projects.models import Project

class Ticket(models.Model):
    """
    A database model storing Jira status of a DMP
    """

    # links to foreign rdmo dmp project id
    project = models.OneToOneField(
            Project,
            on_delete=models.CASCADE,
            primary_key=True,
    )

    # it stores a ticket status 
    ticket_key = models.CharField(
        db_index=True, max_length=100
    )

    # it stores a ticket id 
    ticket_id = models.CharField(
        db_index=True, max_length=100
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Dmp Jira Status: ticket_key: {self.ticket_key}, ticket_id: {self.ticket_id}, created_at: {self.created_at} updated_at: {self.updated_at}"

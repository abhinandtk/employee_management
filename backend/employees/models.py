from django.db import models
from forms.models import DynamicForm

class Employee(models.Model):
    form = models.ForeignKey(DynamicForm, on_delete=models.PROTECT)
    data = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Employee {self.id} for {self.form.name}"

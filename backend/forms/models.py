from django.db import models
from django.conf import settings

class DynamicForm(models.Model):
    name = models.CharField(max_length=255)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class FormField(models.Model):
    FIELD_TYPES = (
        ('text', 'Text'),
        ('number', 'Number'),
        ('date', 'Date'),
        ('password', 'Password'),
    )
    form = models.ForeignKey(DynamicForm, related_name='fields', on_delete=models.CASCADE)
    label = models.CharField(max_length=255)
    field_type = models.CharField(max_length=50, choices=FIELD_TYPES)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.form.name} - {self.label}"

from rest_framework import serializers
from .models import Employee
from forms.serializers import DynamicFormSerializer

class EmployeeSerializer(serializers.ModelSerializer):
    form_details = DynamicFormSerializer(source='form', read_only=True)

    class Meta:
        model = Employee
        fields = ('id', 'form', 'form_details', 'data', 'created_at', 'updated_at')

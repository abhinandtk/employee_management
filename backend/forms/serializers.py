from rest_framework import serializers
from .models import DynamicForm, FormField

class FormFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormField
        fields = ('id', 'label', 'field_type', 'order')

class DynamicFormSerializer(serializers.ModelSerializer):
    fields = FormFieldSerializer(many=True, required=False)

    class Meta:
        model = DynamicForm
        fields = ('id', 'name', 'created_by', 'created_at', 'fields')
        read_only_fields = ('created_by',)

    def create(self, validated_data):
        fields_data = validated_data.pop('fields', [])
        form = DynamicForm.objects.create(**validated_data)
        for field_data in fields_data:
            FormField.objects.create(form=form, **field_data)
        return form

    def update(self, instance, validated_data):
        fields_data = validated_data.pop('fields', None)
        instance.name = validated_data.get('name', instance.name)
        instance.save()

        if fields_data is not None:
            # Simple approach: delete existing and recreate
            instance.fields.all().delete()
            for field_data in fields_data:
                FormField.objects.create(form=instance, **field_data)
        
        return instance

class FieldReorderSerializer(serializers.Serializer):
    field_id = serializers.IntegerField()
    order = serializers.IntegerField()

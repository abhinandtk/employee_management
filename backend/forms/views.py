from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import DynamicForm, FormField
from .serializers import DynamicFormSerializer, FormFieldSerializer, FieldReorderSerializer
from users.permissions import IsAdmin

class DynamicFormViewSet(viewsets.ModelViewSet):
    queryset = DynamicForm.objects.all()
    serializer_class = DynamicFormSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [IsAdmin]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def fields(self, request, pk=None):
        form = self.get_object()
        serializer = FormFieldSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(form=form)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def reorder(self, request, pk=None):
        form = self.get_object()
        serializer = FieldReorderSerializer(data=request.data, many=True)
        if serializer.is_valid():
            for item in serializer.validated_data:
                FormField.objects.filter(form=form, id=item['field_id']).update(order=item['order'])
            return Response({'status': 'fields reordered'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

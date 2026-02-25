from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Employee
from .serializers import EmployeeSerializer
from users.permissions import IsAdmin, IsEmployee
from django.db.models import Q

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def search(self, request):
        query_params = request.query_params
        queryset = self.get_queryset()

        for key, value in query_params.items():
            if key != 'page' and key != 'limit':
                # Map standard lookup to JSONField structure: data__Key__icontains
                kwargs = {f"data__{key}__icontains": value}
                queryset = queryset.filter(**kwargs)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

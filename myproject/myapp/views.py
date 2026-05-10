
from rest_framework import viewsets, permissions
from .models import Task
from .serializer import TaskSerializer, RegistrationSerializer
from django.contrib.auth.models import User
from rest_framework.decorators import action
from rest_framework.response import Response


# Register ViewSet (Only Create allowed)
class RegisterViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = RegistrationSerializer
    http_method_names = ['post']   # only allow POST

    def get_permissions(self):
        return []   # public access


#  Task ViewSet
class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    #  User-wise data isolation
    def get_queryset(self):
        queryset = Task.objects.filter(user=self.request.user)

        #  Filtering
        status = self.request.query_params.get('status')
        priority = self.request.query_params.get('priority')

        if status:
            queryset = queryset.filter(status=status)

        if priority:
            queryset = queryset.filter(priority=priority)

        return queryset

    #  Automatically assign logged-in user
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    #  Custom API: Completed Tasks
    @action(detail=False, methods=['get'])
    def completed(self, request):
        tasks = Task.objects.filter(user=request.user, status='completed')
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)
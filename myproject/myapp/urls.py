from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, RegisterViewSet

router = DefaultRouter()
router.register('register', RegisterViewSet, basename='register')
router.register('task', TaskViewSet, basename='task')

urlpatterns = [
    path('', include(router.urls)),
]

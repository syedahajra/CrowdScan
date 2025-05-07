from django.urls import path
from users.views import (
    CreateUserView, FindUserView, CreateAdminView, GetScanHistoryView
)

app_name = "users"

urlpatterns = [
    path('create/', CreateUserView.as_view(), name="create-user"),
    path('find/', FindUserView.as_view(), name="find-users"),
    path('admin/create/', CreateAdminView.as_view(), name="create-admin"),
    path('admin/<int:pk>/', CreateAdminView.as_view(), name="admin-update"),
    path('history/', GetScanHistoryView.as_view(), name="scan-history"),
]
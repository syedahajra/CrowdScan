from django.urls import path
from users.views import (
    CreateUserView, FindUserView,  GetScanHistoryView
)

app_name = "users"

urlpatterns = [
    path('create/', CreateUserView.as_view(), name="create-user"),
    path('find/', FindUserView.as_view(), name="find-users"),
    path('history/', GetScanHistoryView.as_view(), name="scan-history"),
]
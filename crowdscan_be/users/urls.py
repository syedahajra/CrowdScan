from django.urls import path
from users.views import (
    CreateUserView, FindUserView, CreateBulkUsersView
)

app_name = "users"

urlpatterns = [
    path('create/', CreateUserView.as_view(), name="create-user"),
    path('find/', FindUserView.as_view(), name="find-users"),
    path('add-users/', CreateBulkUsersView.as_view(), name="add-users"),
]
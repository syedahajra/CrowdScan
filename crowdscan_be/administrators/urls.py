from django.urls import path
from administrators.views import (
    CreateUpdateRetrieveDeleteAdminView,
    AdminLoginView,
    AdminLogoutView,
    CheckSessionView,
    ChangePasswordView
)


app_name = "administrators"


urlpatterns = [
    path('admin/create/', CreateUpdateRetrieveDeleteAdminView.as_view(), name="create-admin"),
    path('admin/<int:pk>/', CreateUpdateRetrieveDeleteAdminView.as_view(), name="update-delete-get-admin"),
    path('admin/login/', AdminLoginView.as_view(), name="admin-login"),
    path('admin/logout/', AdminLogoutView.as_view(), name="admin-logout"),
    path('admin/session/check/', CheckSessionView.as_view(), name="check-session"),
    path('admin/', CreateUpdateRetrieveDeleteAdminView.as_view(), name="list-admins"),
    path("admin/change-password/", ChangePasswordView.as_view(), name="change-password"),
]
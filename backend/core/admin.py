# account/admin.py
from django.contrib import admin
from .models import User, Device, IssueRequest, CustomUser

class AdminIssueRequestOverview(admin.ModelAdmin):
    list_display = (
        "id",
        "device",
        "status",
        "user",
    )
    search_fields = ("user",)


class AdminDeviceOverview(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "device_name",
        "address",
    )
    search_fields = ("username",)

admin.site.register(IssueRequest, AdminIssueRequestOverview)
admin.site.register(Device, AdminDeviceOverview)
admin.site.register(CustomUser)

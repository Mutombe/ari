# account/admin.py
from django.contrib import admin
from .models import User, Device, IssueRequest, CustomUser, DeviceDocument

class AdminIssueRequestOverview(admin.ModelAdmin):
    list_display = (
        "id",
        "device",
        "status",
        "user",
    )
    search_fields = ("user",)

class DeviceDocumentInline(admin.TabularInline):
    model = DeviceDocument
    extra = 1

class DeviceAdmin(admin.ModelAdmin):
    inlines = [DeviceDocumentInline]
    list_display = ['device_name', 'user', 'country', 'status', 'created_at']
    search_fields = ['device_name', 'user__username', 'user__email']
    list_filter = ['status', 'country', 'fuel_type']
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "user":
            kwargs["queryset"] = CustomUser.objects.all()
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
    
    def save_model(self, request, obj, form, change):
        if not change:  # Only set the user when creating, not when updating
            obj.user = request.user
        super().save_model(request, obj, form, change)

admin.site.register(Device, DeviceAdmin)
admin.site.register(IssueRequest, AdminIssueRequestOverview)
admin.site.register(CustomUser)

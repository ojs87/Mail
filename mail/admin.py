from django.contrib import admin
from .models import Email, User

class EmailAdmin(admin.ModelAdmin):
    list_display =("timestamp", "sender" )


admin.site.register(Email, EmailAdmin);
admin.site.register(User)
# Register your models here.

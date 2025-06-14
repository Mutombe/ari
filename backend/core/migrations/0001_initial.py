# Generated by Django 5.1.7 on 2025-05-18 20:11

import django.contrib.auth.models
import django.contrib.auth.validators
import django.core.validators
import django.db.models.deletion
import django.utils.timezone
from decimal import Decimal
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
    ]

    operations = [
        migrations.CreateModel(
            name="CustomUser",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("password", models.CharField(max_length=128, verbose_name="password")),
                (
                    "last_login",
                    models.DateTimeField(
                        blank=True, null=True, verbose_name="last login"
                    ),
                ),
                (
                    "is_superuser",
                    models.BooleanField(
                        default=False,
                        help_text="Designates that this user has all permissions without explicitly assigning them.",
                        verbose_name="superuser status",
                    ),
                ),
                (
                    "username",
                    models.CharField(
                        error_messages={
                            "unique": "A user with that username already exists."
                        },
                        help_text="Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.",
                        max_length=150,
                        unique=True,
                        validators=[
                            django.contrib.auth.validators.UnicodeUsernameValidator()
                        ],
                        verbose_name="username",
                    ),
                ),
                (
                    "first_name",
                    models.CharField(
                        blank=True, max_length=150, verbose_name="first name"
                    ),
                ),
                (
                    "last_name",
                    models.CharField(
                        blank=True, max_length=150, verbose_name="last name"
                    ),
                ),
                (
                    "email",
                    models.EmailField(
                        blank=True, max_length=254, verbose_name="email address"
                    ),
                ),
                (
                    "is_staff",
                    models.BooleanField(
                        default=False,
                        help_text="Designates whether the user can log into this admin site.",
                        verbose_name="staff status",
                    ),
                ),
                (
                    "is_active",
                    models.BooleanField(
                        default=True,
                        help_text="Designates whether this user should be treated as active. Unselect this instead of deleting accounts.",
                        verbose_name="active",
                    ),
                ),
                (
                    "date_joined",
                    models.DateTimeField(
                        default=django.utils.timezone.now, verbose_name="date joined"
                    ),
                ),
                (
                    "country",
                    models.CharField(
                        blank=True,
                        choices=[
                            ("Uganda", "Uganda"),
                            ("Zambia", "Zambia"),
                            ("Malawi", "Malawi"),
                            ("Namibia", "Namibia"),
                            ("Lesotho", "Lesotho"),
                            ("Eswatini", "Eswatini"),
                            ("Angola", "Angola"),
                            ("DRC", "DRC"),
                        ],
                        help_text="The country associated with this user account",
                        max_length=20,
                        null=True,
                        verbose_name="Country",
                    ),
                ),
                (
                    "groups",
                    models.ManyToManyField(
                        blank=True,
                        related_name="custom_user_set",
                        related_query_name="custom_user",
                        to="auth.group",
                        verbose_name="groups",
                    ),
                ),
                (
                    "user_permissions",
                    models.ManyToManyField(
                        blank=True,
                        related_name="custom_user_set",
                        related_query_name="custom_user",
                        to="auth.permission",
                        verbose_name="user permissions",
                    ),
                ),
            ],
            options={
                "verbose_name": "user",
                "verbose_name_plural": "users",
            },
            managers=[
                ("objects", django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name="Device",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("Draft", "Draft"),
                            ("Submitted", "Submitted"),
                            ("Approved", "Approved"),
                            ("Rejected", "Rejected"),
                        ],
                        default="draft",
                        max_length=20,
                    ),
                ),
                ("device_name", models.CharField(max_length=255)),
                ("issuer_organisation", models.CharField(max_length=255)),
                (
                    "default_account_code",
                    models.CharField(blank=True, max_length=255, null=True),
                ),
                ("fuel_type", models.CharField(max_length=10)),
                ("technology_type", models.CharField(max_length=10)),
                (
                    "capacity",
                    models.DecimalField(
                        decimal_places=6,
                        max_digits=10,
                        validators=[
                            django.core.validators.MinValueValidator(
                                Decimal("0.000001")
                            )
                        ],
                    ),
                ),
                ("commissioning_date", models.DateField(blank=True, null=True)),
                ("effective_date", models.DateField(blank=True, null=True)),
                ("address", models.TextField()),
                ("country", models.CharField(max_length=100)),
                (
                    "latitude",
                    models.DecimalField(
                        decimal_places=6,
                        max_digits=9,
                        validators=[
                            django.core.validators.MinValueValidator(Decimal("-90.0")),
                            django.core.validators.MaxValueValidator(Decimal("90.0")),
                        ],
                    ),
                ),
                (
                    "longitude",
                    models.DecimalField(
                        decimal_places=6,
                        max_digits=9,
                        validators=[
                            django.core.validators.MinValueValidator(Decimal("-180.0")),
                            django.core.validators.MaxValueValidator(Decimal("180.0")),
                        ],
                    ),
                ),
                ("postcode", models.CharField(default="000000", max_length=20)),
                (
                    "meter_ids",
                    models.TextField(
                        blank=True, help_text="Meter or Measurement ID(s)", null=True
                    ),
                ),
                (
                    "network_owner",
                    models.CharField(
                        blank=True,
                        help_text="Owner of the network to which the Production Device is connected",
                        max_length=255,
                        null=True,
                    ),
                ),
                (
                    "connection_voltage",
                    models.CharField(blank=True, max_length=50, null=True),
                ),
                (
                    "grid_connection_details",
                    models.TextField(
                        blank=True,
                        help_text="If not connected directly to the grid, specify the circumstances",
                        null=True,
                    ),
                ),
                (
                    "volume_evidence_type",
                    models.CharField(
                        blank=True,
                        choices=[
                            ("Metering", "Metering data"),
                            ("Invoice", "Contract sales invoice"),
                            ("Other", "Other"),
                        ],
                        max_length=20,
                        null=True,
                    ),
                ),
                (
                    "volume_evidence_other",
                    models.CharField(blank=True, max_length=255, null=True),
                ),
                (
                    "carbon_offset_registration",
                    models.CharField(
                        blank=True,
                        help_text="Carbon offset or energy tracking scheme registration ID",
                        max_length=255,
                        null=True,
                    ),
                ),
                (
                    "labelling_scheme",
                    models.CharField(blank=True, max_length=255, null=True),
                ),
                (
                    "public_funding",
                    models.CharField(
                        choices=[
                            ("No", "No"),
                            ("Investment", "Investment"),
                            ("Production", "Production"),
                        ],
                        default="No",
                        max_length=20,
                    ),
                ),
                ("funding_end_date", models.DateField(blank=True, null=True)),
                (
                    "onsite_consumer",
                    models.CharField(
                        choices=[("Yes", "Yes"), ("No", "No")],
                        default="No",
                        max_length=3,
                    ),
                ),
                ("onsite_consumer_details", models.TextField(blank=True, null=True)),
                (
                    "auxiliary_energy",
                    models.CharField(
                        choices=[("Yes", "Yes"), ("No", "No")],
                        default="No",
                        max_length=3,
                    ),
                ),
                ("auxiliary_energy_details", models.TextField(blank=True, null=True)),
                (
                    "electricity_import_details",
                    models.TextField(
                        blank=True,
                        help_text="Details of how the site can import electricity by means other than through the meter(s)",
                        null=True,
                    ),
                ),
                (
                    "production_facility_registration",
                    models.FileField(
                        null=True, upload_to="device_documents/facility_registration/"
                    ),
                ),
                (
                    "declaration_of_ownership",
                    models.FileField(
                        null=True, upload_to="device_documents/ownership_declaration/"
                    ),
                ),
                (
                    "metering_evidence",
                    models.FileField(
                        null=True, upload_to="device_documents/metering_evidence/"
                    ),
                ),
                (
                    "single_line_diagram",
                    models.FileField(
                        null=True, upload_to="device_documents/single_line_diagram/"
                    ),
                ),
                (
                    "project_photos",
                    models.FileField(
                        null=True, upload_to="device_documents/project_photos/"
                    ),
                ),
                ("additional_notes", models.TextField(blank=True, null=True)),
                ("rejection_reason", models.TextField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="devices",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="DeviceDocument",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "document_type",
                    models.CharField(
                        choices=[
                            ("SF02", "SF-02 Production Facility Registration"),
                            ("SF02C", "SF-02C Ownership Declaration"),
                            ("METER", "Metering Evidence"),
                            ("DIAGRAM", "Single Line Diagram"),
                            ("PHOTOS", "Project Photos"),
                        ],
                        max_length=10,
                    ),
                ),
                ("file", models.FileField(upload_to="device_documents/%Y/%m/%d/")),
                ("uploaded_at", models.DateTimeField(auto_now_add=True)),
                (
                    "device",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="documents",
                        to="core.device",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="IssueRequest",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("draft", "Draft"),
                            ("submitted", "Submitted"),
                            ("approved", "Approved"),
                            ("rejected", "Rejected"),
                        ],
                        default="draft",
                        max_length=20,
                    ),
                ),
                ("start_date", models.DateField()),
                ("end_date", models.DateField()),
                ("period_of_production", models.CharField(blank=True, max_length=255)),
                (
                    "production_amount",
                    models.DecimalField(decimal_places=6, max_digits=15),
                ),
                ("recipient_account", models.CharField(max_length=255)),
                ("notes", models.TextField(blank=True, null=True)),
                (
                    "upload_file",
                    models.FileField(null=True, upload_to="issue-requests/"),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "device",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="issue_requests",
                        to="core.device",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]

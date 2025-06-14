from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User  
from decimal import Decimal
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class CustomUser(AbstractUser):
    """
    Custom User model that extends the built-in User model
    to include country information.
    """
    COUNTRY_CHOICES = [
        ('Uganda', 'Uganda'),
        ('Zambia', 'Zambia'),
        ('Malawi', 'Malawi'),
        ('Namibia', 'Namibia'),
        ('Lesotho', 'Lesotho'),
        ('Eswatini', 'Eswatini'),
        ('Angola', 'Angola'),
        ('DRC', 'DRC'),
    ]
    
    country = models.CharField(
        _("Country"),
        max_length=20,
        choices=COUNTRY_CHOICES,
        blank=True,
        null=True,
        help_text=_("The country associated with this user account")
    )

    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        related_name='custom_user_set',
        related_query_name='custom_user'
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        related_name='custom_user_set',
        related_query_name='custom_user'
    )
    
    class Meta:
        verbose_name = _("user")
        verbose_name_plural = _("users")

    def __str__(self):
        return self.username
    
    @property
    def brand_name(self):
        """Returns the brand name based on the user's country"""
        brand_mapping = {
            'Uganda': 'Ugarec',
            'Zambia': 'Zamrec',
            'Malawi': 'Malrec',
            'Namibia': 'Namrec',
            'Lesotho': 'Lesrec',
            'Eswatini': 'Eswarec',
            'Angola': 'Angrec',
            'DRC': 'DRCrec',
        }
        return brand_mapping.get(self.country, 'Africa RECs')
    
    @property
    def flag_emoji(self):
        """Returns the flag emoji based on the user's country"""
        flag_mapping = {
            'Uganda': '🇺🇬',
            'Zambia': '🇿🇲',
            'Malawi': '🇲🇼',
            'Namibia': '🇳🇦',
            'Lesotho': '🇱🇸',
            'Eswatini': '🇸🇿',
            'Angola': '🇦🇴',
            'DRC': '🇨🇩',
        }
        return flag_mapping.get(self.country, '')
    
#class Profile(models.Model):
    
    #user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="profile")
    #first_name = models.CharField(max_length=100, blank=True)
    #last_name = models.CharField(max_length=100, blank=True)
    #profile_picture = models.ImageField(
        #upload_to="profile_pictures/", null=True, blank=True
   # )
    #created_at = models.DateTimeField(auto_now_add=True)
    #updated_at = models.DateTimeField(auto_now=True)

    #def __str__(self):
        #return f"{self.user.username}'s Profile"


class Device(models.Model):
    STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('Submitted', 'Submitted'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]

    VOLUME_EVIDENCE_CHOICES = [
        ('Metering', 'Metering data'),
        ('Invoice', 'Contract sales invoice'),
        ('Other', 'Other'),
    ]
    
    FUNDING_CHOICES = [
        ('No', 'No'),
        ('Investment', 'Investment'),
        ('Production', 'Production'),
    ]
    
    ONSITE_CONSUMER_CHOICES = [
        ('Yes', 'Yes'),
        ('No', 'No'),
    ]
    
    AUXILIARY_ENERGY_CHOICES = [
        ('Yes', 'Yes'),
        ('No', 'No'),
    ]

    FUEL_TECHNOLOGY_MAP = {
        'Solar': ['TC110', 'TC120', 'TC130', 'TC140', 'TC150'],
        'Wind': ['TC210', 'TC220'],
        'Hydro': ['TC310', 'TC320', 'TC330'],
        'Biomas': ['TC410', 'TC411', 'TC421', 'TC422', 'TC423', 'TC424', 'TC431', 'TC432', 'TC441', 'TC442', 'TC482'],
        'Geothermal': ['TC510', 'TC520', 'TC530'],
        'Municipal Waste': ['TC410', 'TC411', 'TC421', 'TC422', 'TC423', 'TC424', 'TC431', 'TC432', 'TC441', 'TC442'],
    }

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='devices')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    
    # General Information
    device_name = models.CharField(max_length=255)
    issuer_organisation = models.CharField(max_length=255)
    default_account_code = models.CharField(max_length=255, blank=True, null=True)
    
    # Technical Information
    fuel_type = models.CharField(max_length=10)
    technology_type = models.CharField(max_length=10)
    capacity = models.DecimalField(
        max_digits=10, 
        decimal_places=6,
         validators=[MinValueValidator(Decimal('0.000001'))]
    )
    commissioning_date = models.DateField(null=True, blank=True)
    effective_date = models.DateField(null=True, blank=True)
    
    # Location Information
    address = models.TextField()
    country = models.CharField(max_length=100)
    latitude = models.DecimalField(
        max_digits=9,  # 3 digits before + 6 after = 9 total
        decimal_places=6,
        validators=[
            MinValueValidator(Decimal('-90.0')),
            MaxValueValidator(Decimal('90.0'))
        ]
    )
    
    longitude = models.DecimalField(
        max_digits=9,  # 3 digits before + 6 after = 9 total
        decimal_places=6,
        validators=[
            MinValueValidator(Decimal('-180.0')),
            MaxValueValidator(Decimal('180.0'))
        ]
    )
    postcode = models.CharField(max_length=20, default='000000')

    meter_ids = models.TextField(blank=True, null=True, help_text="Meter or Measurement ID(s)")
    network_owner = models.CharField(max_length=255, blank=True, null=True, 
                                   help_text="Owner of the network to which the Production Device is connected")
    connection_voltage = models.CharField(max_length=50, blank=True, null=True)
    grid_connection_details = models.TextField(blank=True, null=True, 
                                             help_text="If not connected directly to the grid, specify the circumstances")
    volume_evidence_type = models.CharField(max_length=20, choices=VOLUME_EVIDENCE_CHOICES, blank=True, null=True)
    volume_evidence_other = models.CharField(max_length=255, blank=True, null=True)
    
    # Registration and Certification
    carbon_offset_registration = models.CharField(max_length=255, blank=True, null=True, 
                                                help_text="Carbon offset or energy tracking scheme registration ID")
    labelling_scheme = models.CharField(max_length=255, blank=True, null=True)
    public_funding = models.CharField(max_length=20, choices=FUNDING_CHOICES, default='No')
    funding_end_date = models.DateField(null=True, blank=True)
    
    # Business Details
    onsite_consumer = models.CharField(max_length=3, choices=ONSITE_CONSUMER_CHOICES, default='No')
    onsite_consumer_details = models.TextField(blank=True, null=True)
    auxiliary_energy = models.CharField(max_length=3, choices=AUXILIARY_ENERGY_CHOICES, default='No')
    auxiliary_energy_details = models.TextField(blank=True, null=True)
    electricity_import_details = models.TextField(blank=True, null=True, 
                                               help_text="Details of how the site can import electricity by means other than through the meter(s)")
    
    
    # Audit Fields
    production_facility_registration = models.FileField(upload_to='device_documents/facility_registration/', null=True)
    declaration_of_ownership = models.FileField(upload_to='device_documents/ownership_declaration/', null=True)
    metering_evidence = models.FileField(upload_to='device_documents/metering_evidence/', null=True)
    single_line_diagram = models.FileField(upload_to='device_documents/single_line_diagram/', null=True)
    project_photos = models.FileField(upload_to='device_documents/project_photos/', null=True)
    additional_notes = models.TextField(blank=True, null=True)
    rejection_reason = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    _original_status = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._original_status = self.status
        self.status_changed = False

    def save(self, *args, **kwargs):
        self.status_changed = self.status != self._original_status
        super().save(*args, **kwargs)
        self._original_status = self.status


    def clean(self):
        """Validate technology type against fuel type"""
        from django.core.exceptions import ValidationError
        if self.technology_type not in self.FUEL_TECHNOLOGY_MAP.get(self.fuel_type, []):
            raise ValidationError("Invalid technology for selected fuel type")
        


class DeviceDocument(models.Model):
    DOCUMENT_TYPES = [
        ('SF02', 'SF-02 Production Facility Registration'),
        ('SF02C', 'SF-02C Ownership Declaration'),
        ('METER', 'Metering Evidence'),
        ('DIAGRAM', 'Single Line Diagram'),
        ('PHOTOS', 'Project Photos'),
    ]

    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='documents')
    document_type = models.CharField(max_length=10, choices=DOCUMENT_TYPES)
    file = models.FileField(upload_to='device_documents/%Y/%m/%d/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

class IssueRequest(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='issue_requests')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    start_date = models.DateField()
    end_date = models.DateField()
    period_of_production = models.CharField(max_length=255, blank=True)
    production_amount = models.DecimalField(max_digits=15, decimal_places=6)
    recipient_account = models.CharField(max_length=255)
    notes = models.TextField(blank=True, null=True)
    upload_file = models.FileField(upload_to='issue-requests/', null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    _original_status = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._original_status = self.status

    def save(self, *args, **kwargs):
        self.status_changed = self.status != self._original_status
        super().save(*args, **kwargs)
        self._original_status = self.status
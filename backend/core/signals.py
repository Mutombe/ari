from django.db.models.signals import post_save
from django.core.mail import send_mail
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from .models import Device, IssueRequest, CustomUser
from django.db import transaction
from django.contrib.auth.models import User  
from django.core.mail import EmailMultiAlternatives
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.urls import reverse
from django_rest_passwordreset.signals import reset_password_token_created
from django.conf import settings 
import logging
logger = logging.getLogger(__name__)

ADMIN_EMAILS = ['simbamtombe@gmail.com','kuda@africarbontraining.com', 'shyline@africarbontraining.com', 'trevor@africarbontraining.com', 'simbarashemutombe1@gmail.com']

def send_admin_notification(subject, context, template_base):

    context.update({
        'admin_url': settings.ADMIN_BASE_URL,
        'app_name': settings.APP_NAME
    })

    text_message = render_to_string(f'emails/admin/{template_base}.txt', context)
    html_message = render_to_string(f'emails/admin/{template_base}.html', context)
    
    send_mail(
        subject=subject,
        message=text_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=ADMIN_EMAILS,
        html_message=html_message,
        fail_silently=False
    )

# User registration signal
@receiver(post_save, sender=CustomUser)
def handle_new_user(sender, instance, created, **kwargs):
    if created:
        # Define attachment paths (modify these to your actual files)
        attachments = [
            settings.BASE_DIR / 'media/docs/ZIM-RECs Registration Process.pdf',
            settings.BASE_DIR / 'media/docs/Silver Carbon - Service Level Agreement.docx',
            settings.BASE_DIR / 'media/docs/ZIM-REC Platform Guide.pdf'
        ]
        
        # Send user confirmation email with attachments
        send_status_email(instance, 'user', 'created', attachments=attachments)
        
        # Send admin notification
        context = {
            'user': instance,
            'event_type': 'New User Registration',
            'app_name': 'Zim-Rec'
        }
        send_admin_notification(
            subject="New User Registration",
            context=context,
            template_base='new_user'
        )

def send_status_emaill(user, entity_type, status):
    subject = f"{entity_type.title()} Status Update"
    context = {
        'user': user,
        'entity_type': entity_type,
        'status': status,
        'app_name': 'Zim-Rec'
    }
    
    text_message = render_to_string(f'emails/user/{entity_type}_status_update.txt', context)
    html_message = render_to_string(f'emails/user/{entity_type}_status_update.html', context)
    
    send_mail(
        subject=subject,
        message=text_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message,
        fail_silently=False
    )

def send_status_email(user, entity_type, status, attachments=None):
    subject = f"{entity_type.title()} Status Update"
    context = {
        'user': user,
        'entity_type': entity_type,
        'status': status,
        'app_name': 'Zim-Rec'
    }
    
    text_message = render_to_string(f'emails/user/{entity_type}_status_update.txt', context)
    html_message = render_to_string(f'emails/user/{entity_type}_status_update.html', context)
    
    # Create EmailMultiAlternatives object
    email = EmailMultiAlternatives(
        subject=subject,
        body=text_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
    )
    email.attach_alternative(html_message, "text/html")
    
    # Attach files if provided
    if attachments:
        for attachment in attachments:
            email.attach_file(attachment)
    
    email.send(fail_silently=False)

@receiver(post_save, sender=Device)
def handle_device_changes(sender, instance, created, **kwargs):
    # Notify admin about new device submission
    if created:
        context = {
            'device': instance,
            'user': instance.user,
            'event_type': 'New Device Submission',
            'app_name': 'Zim-Rec'
        }
        send_admin_notification(
            subject=f"New Device Submitted: {instance.device_name}",
            context=context,
            template_base='new_device'
        )
    
    # Status change notifications
    if hasattr(instance, 'status_changed') and instance.status_changed:
        send_status_email(instance.user, 'device', instance.status)
        
        # Notify admin about status change
        context = {
            'device': instance,
            'user': instance.user,
            'old_status': instance._original_status,
            'new_status': instance.status,
            'event_type': 'Device Status Change',
            'app_name': 'Zim-Rec'
        }
        send_admin_notification(
            subject=f"Device Status Changed: {instance.device_name}",
            context=context,
            template_base='device_status_change'
        )

@receiver(post_save, sender=IssueRequest)
def handle_issue_request_changes(sender, instance, created, **kwargs):
    # Notify admin about new issue request
    if created:
        context = {
            'issue_request': instance,
            'user': instance.user,
            'event_type': 'New Issue Request',
            'app_name': 'Zim-Rec'
        }
        send_admin_notification(
            subject=f"New Issue Request from {instance.user.email}",
            context=context,
            template_base='new_issue_request'
        )
    
    # Status change notifications
    if hasattr(instance, 'status_changed') and instance.status_changed:
        send_status_email(instance.user, 'issue_request', instance.status)
        
        # Notify admin about status change
        context = {
            'issue_request': instance,
            'user': instance.user,
            'old_status': instance._original_status,
            'new_status': instance.status,
            'event_type': 'Issue Request Status Change',
            'app_name': 'Zim-Rec'
        }
        send_admin_notification(
            subject=f"Issue Request Status Changed: {instance.device.device_name}",
            context=context,
            template_base='issue_request_status_change'
        )

@receiver(post_save, sender=Device)
def handle_device_status_change(sender, instance, **kwargs):
    if instance.status_changed:
        send_status_email(instance.user, 'device', instance.status)

@receiver(post_save, sender=IssueRequest)
def handle_issue_request_status_change(sender, instance, **kwargs):
    if instance.status_changed:
        send_status_email(instance.user, 'issue_request', instance.status)

#@receiver(post_save, sender=CustomUser)
#def create_user_profile(sender, instance, created, **kwargs):
 #   if created:
        # Defer Profile creation until the transaction is committed
  #      transaction.on_commit(lambda: Profile.objects.create(user=instance))

#@receiver(post_save, sender=CustomUser)
#def save_user_profile(sender, instance, **kwargs):
 #   if hasattr(instance, 'profile'):
  #      instance.profile.save()

@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    """
    Custom handler for password reset tokens
    """
    # Build frontend URL instead of backend URL
    frontend_url = f"{settings.FRONTEND_URL}/reset-password?token={reset_password_token.key}"
    
    context = {
        'current_user': reset_password_token.user,
        'username': reset_password_token.user.username,
        'email': reset_password_token.user.email,
        'reset_password_url': frontend_url,  
        'support_email': settings.SUPPORT_EMAIL,
        'site_name': settings.SITE_NAME,
        'expiry_hours': settings.DJANGO_REST_PASSWORDRESET['TOKEN_EXPIRY'] // 3600
    }

    # Render email content
    email_html_message = render_to_string('emails/user_reset_password.html', context)
    email_plaintext_message = render_to_string('emails/user_reset_password.txt', context)

    msg = EmailMultiAlternatives(
        # Dynamic subject with site name
        subject=f"Password Reset for {settings.SITE_NAME}",
        body=email_plaintext_message,
        from_email=settings.DEFAULT_FROM_EMAIL,  # Use configured email
        to=[reset_password_token.user.email],
        reply_to=[settings.SUPPORT_EMAIL]
    )
    msg.attach_alternative(email_html_message, "text/html")
    
    try:
        msg.send()
    except Exception as e:
        # Log email sending errors
        logger.error(f"Failed to send password reset email: {str(e)}")
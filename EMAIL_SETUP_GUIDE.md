# Email Setup Guide for FutureBank

## Overview
This guide helps you set up custom email templates in Supabase to improve the user experience during signup and email confirmation.

## Setting Up Custom Email Templates

### 1. Access Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Email Templates**

### 2. Configure Confirmation Email Template

#### Template Settings:
- **Template Name**: `Confirm signup`
- **Subject**: `Welcome to FutureBank! Please confirm your email`
- **From Email**: `noreply@yourdomain.com` (or your custom domain)
- **From Name**: `FutureBank Team`

#### Email Content:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to FutureBank</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 40px 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 12px; margin-bottom: 30px; }
        .logo { font-size: 32px; font-weight: bold; margin-bottom: 10px; }
        .tagline { font-size: 18px; opacity: 0.9; }
        .content { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .button:hover { background: #5a6fd8; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .highlight { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">⏰ FutureBank</div>
            <div class="tagline">Time Banking for Communities</div>
        </div>
        
        <div class="content">
            <h1>Welcome to FutureBank! 🎉</h1>
            
            <p>Hi there!</p>
            
            <p>Thank you for joining <strong>FutureBank</strong> - where communities exchange time, skills, and goodwill. You're now part of a growing network of people helping each other.</p>
            
            <div class="highlight">
                <h3>What's Next?</h3>
                <ul>
                    <li>✅ Confirm your email (click the button below)</li>
                    <li>🛠️ Create your first offer or want</li>
                    <li>🤝 Start connecting with your community</li>
                    <li>⏰ Earn and spend time credits</li>
                </ul>
            </div>
            
            <p>To get started, please confirm your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
                <a href="{{ .ConfirmationURL }}" class="button">Confirm My Email</a>
            </div>
            
            <p style="margin-top: 30px; font-size: 14px; color: #666;">
                If the button doesn't work, you can also copy and paste this link into your browser:<br>
                <a href="{{ .ConfirmationURL }}" style="color: #667eea;">{{ .ConfirmationURL }}</a>
            </p>
            
            <div class="highlight">
                <h3>About FutureBank</h3>
                <p>FutureBank is a time banking platform where you can:</p>
                <ul>
                    <li>Offer your skills and time to help others</li>
                    <li>Request help from community members</li>
                    <li>Earn time credits for your contributions</li>
                    <li>Build meaningful connections in your community</li>
                </ul>
            </div>
        </div>
        
        <div class="footer">
            <p>This email was sent to {{ .Email }}. If you didn't create a FutureBank account, you can safely ignore this email.</p>
            <p>© 2024 FutureBank. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

### 3. Configure Magic Link Email Template (Optional)

If you want to enable magic link sign-ins, also configure the "Magic Link" template:

#### Template Settings:
- **Template Name**: `Magic Link`
- **Subject**: `Sign in to FutureBank`
- **From Email**: `noreply@yourdomain.com`
- **From Name**: `FutureBank Team`

#### Email Content:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign in to FutureBank</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 30px 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 12px; margin-bottom: 30px; }
        .logo { font-size: 28px; font-weight: bold; }
        .content { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">⏰ FutureBank</div>
        </div>
        
        <div class="content">
            <h1>Sign in to FutureBank</h1>
            
            <p>Hi there!</p>
            
            <p>You requested a sign-in link for your FutureBank account. Click the button below to sign in securely:</p>
            
            <div style="text-align: center;">
                <a href="{{ .TokenHash }}" class="button">Sign In to FutureBank</a>
            </div>
            
            <p style="margin-top: 30px; font-size: 14px; color: #666;">
                If you didn't request this sign-in link, you can safely ignore this email.
            </p>
        </div>
        
        <div class="footer">
            <p>This email was sent to {{ .Email }}.</p>
            <p>© 2024 FutureBank. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

### 4. Configure Email Settings

In your Supabase dashboard, go to **Authentication** → **Settings**:

#### SMTP Settings (Optional - for custom domain):
- **SMTP Host**: Your SMTP server
- **SMTP Port**: 587 (or your provider's port)
- **SMTP User**: Your SMTP username
- **SMTP Pass**: Your SMTP password
- **SMTP Admin Email**: Your admin email

#### Site URL:
- Set your production URL (e.g., `https://yourdomain.com`)
- This ensures confirmation links go to the right place

### 5. Test the Email Templates

1. **Test Signup Flow**:
   - Create a new account
   - Check that the confirmation email is sent
   - Verify the email styling and content
   - Test the confirmation link

2. **Test Resend Functionality**:
   - Try the "resend confirmation" feature
   - Verify the email is resent correctly

## Customization Options

### Branding
- Update the logo and colors to match your brand
- Change the gradient colors in the header
- Modify the button colors

### Content
- Add your own welcome message
- Include community guidelines
- Add links to your social media
- Include contact information

### Localization
- Create multiple templates for different languages
- Use conditional content based on user preferences

## Troubleshooting

### Email Not Sending
1. Check your SMTP settings
2. Verify your domain is properly configured
3. Check spam filters

### Links Going to Localhost
1. Update your Site URL in Supabase settings
2. Ensure your production URL is correct
3. Check your environment variables

### Template Not Updating
1. Clear your browser cache
2. Wait a few minutes for changes to propagate
3. Test with a new email address

## Security Notes

- Never include sensitive information in email templates
- Use HTTPS for all links
- Consider rate limiting for email sending
- Monitor email delivery rates

## Next Steps

After setting up the email templates:

1. Test the complete signup flow
2. Monitor email delivery rates
3. Gather user feedback on the email experience
4. Consider A/B testing different email content 
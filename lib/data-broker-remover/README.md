# Data Broker Remover Tool - Setup Guide

## Overview

The Data Broker Remover tool is integrated into the Visible frontend as a self-contained module. It uses AWS SES for sending emails and DynamoDB for storing verification data.

## Architecture

- **Frontend**: React components in Next.js 16
- **Backend**: Server Actions for AWS service integration
- **Storage**: DynamoDB for email verification tracking
- **Email**: AWS SES for sending verification codes and removal requests
- **Privacy**: Email addresses are hashed (SHA256) before storage

## Required AWS Services

### 1. AWS SES (Simple Email Service)

**Email Templates Required:**

1. **VerificationCode** - Sends verification code to users
   - Template variables: `{{code}}`
   - From: `noreply@visiblelabs.org`

2. **CompanyEmail** - Sends removal requests to data brokers
   - Template variables: `{{name}}`, `{{street}}`, `{{city}}`, `{{country}}`, `{{postcode}}`, `{{email}}`, `{{companyName}}`
   - From: `requests@visiblelabs.org`
   - Reply-To: User's email address

**Setup Steps:**
1. Verify sender email addresses in SES
2. Create email templates using the AWS SES console or CLI
3. Move out of sandbox mode if needed (for production)

### 2. AWS DynamoDB

**Table Schema:**
- **Table Name**: `data-broker-remover-users` (configurable)
- **Primary Key**: `id` (String) - SHA256 hash of email
- **Attributes**:
  - `code` (String) - Verification code
  - `verified` (Boolean) - Email verification status
  - `lastSent` (Number) - Unix timestamp of last email send
  - `dateDate` (Number) - Day of month for tracking

**Setup Steps:**
1. Create DynamoDB table with on-demand billing
2. Set up appropriate IAM permissions for the application

### 3. IAM Permissions

The application needs permissions for:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendTemplatedEmail",
        "ses:SendBulkTemplatedEmail"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem"
      ],
      "Resource": "arn:aws:dynamodb:REGION:ACCOUNT:table/TABLE_NAME"
    }
  ]
}
```

## Environment Variables

Add these to your `.env.local` file:

```bash
# AWS Configuration
VITE_AWS_REGION=eu-west-2
VITE_TABLE_NAME=data-broker-remover-users

# Data Broker Email List (format: Name,email:Name,email:...)
VITE_COMPANIES=BidSwitch,contact@bidswitch.com:VUUKLE,privacy@vuukle.com:Bookyourdata,opt-out@bookyourdata.com
```

## Data Broker Email List

The `VITE_COMPANIES` environment variable contains the list of data brokers and their contact emails. Format:

```
Name1,email1@domain.com:Name2,email2@domain.com:Name3,email3@domain.com
```

Update this list to add or remove data brokers.

## Testing

### Local Development Testing

1. **Test Email Verification:**
   ```bash
   # Use a verified email address in SES (sandbox mode)
   ```

2. **Test Email Sending:**
   ```bash
   # Ensure SES templates are created
   # Verify sender addresses
   ```

### Production Deployment

1. Move SES out of sandbox mode
2. Verify production domain
3. Set up production DynamoDB table
4. Update environment variables

## Rate Limiting

- Users can only send removal requests once every 45 days
- Email addresses are hashed and stored only for rate limiting
- Rate limit is based on hashed email to prevent spam

## Privacy & Data Handling

- **Email Storage**: SHA256 hashed, deleted after 45 days
- **User Details**: NOT stored - only used to generate email templates
- **Verification Codes**: Temporary, stored only during verification process

## Open Source Considerations

This tool is designed to be extractable as open source:

1. **Self-Contained**: All code in `lib/data-broker-remover/`, `components/data-broker-remover/`, `actions/data-broker-remover/`
2. **Configurable**: AWS services and broker list via environment variables
3. **Documented**: Clear setup instructions and requirements
4. **Independent**: No dependencies on Visible-specific backend services

## Troubleshooting

### Email Not Sending
- Verify SES sender addresses are verified
- Check SES is out of sandbox mode (production)
- Verify IAM permissions are correct

### Verification Code Not Received
- Check SES email templates are created
- Verify sender email is verified in SES
- Check CloudWatch logs for errors

### Rate Limit Issues
- Check DynamoDB table has correct schema
- Verify 45-day calculation is working correctly
- Check lastSent timestamp in DynamoDB

## File Structure

```
apps/frontend/
├── lib/data-broker-remover/
│   ├── types.ts              # TypeScript interfaces
│   ├── broker-list.ts        # Data broker names for UI
│   ├── aws-clients.ts        # AWS SDK client configuration
│   └── README.md            # This file
├── components/data-broker-remover/
│   ├── DataBrokerWizard.tsx  # Main wizard component
│   ├── EmailStep.tsx         # Step 1: Email entry
│   ├── VerifyStep.tsx        # Step 2: Verification
│   ├── DetailsStep.tsx       # Step 3: User details
│   ├── ReviewStep.tsx        # Step 4: Review & send
│   └── DataBrokerInfo.tsx    # FAQ and broker list
├── actions/data-broker-remover/
│   ├── send-code.ts          # Send verification code
│   ├── verify-code.ts        # Verify code
│   └── send-emails.ts        # Send removal emails
└── app/tools/data-broker-remover/
    └── page.tsx              # Tool page
```

## Support

For issues or questions:
- Check AWS CloudWatch logs
- Verify environment variables are set
- Check DynamoDB table permissions
- Review SES sending statistics

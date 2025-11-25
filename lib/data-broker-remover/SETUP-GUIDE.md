# Data Broker Remover - Step-by-Step Setup Guide

This guide walks you through setting up the AWS services and environment variables needed to run the Data Broker Remover tool.

## Step 1: Configure AWS Services

### 1.1 Create DynamoDB Table

**Via AWS Console:**
1. Go to AWS Console → DynamoDB → Tables
2. Click "Create table"
3. Configure:
   - **Table name**: `data-broker-remover-users`
   - **Partition key**: `id` (String)
   - **Table settings**: Use default settings or "On-demand" for billing
4. Click "Create table"

**Via AWS CLI:**
```bash
aws dynamodb create-table \
    --table-name data-broker-remover-users \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region eu-west-2
```

### 1.2 Set Up AWS SES

#### A. Verify Sender Email Addresses

**Via AWS Console:**
1. Go to AWS Console → Amazon SES → Verified identities
2. Click "Create identity"
3. Choose "Email address"
4. Enter: `noreply@visiblelabs.org`
5. Click "Create identity"
6. Check your email and click the verification link
7. Repeat for: `requests@visiblelabs.org`

**Via AWS CLI:**
```bash
# Verify noreply email
aws ses verify-email-identity \
    --email-address noreply@visiblelabs.org \
    --region eu-west-2

# Verify requests email
aws ses verify-email-identity \
    --email-address requests@visiblelabs.org \
    --region eu-west-2
```

#### B. Create Email Template: VerificationCode

**Via AWS Console:**
1. Go to AWS Console → Amazon SES → Email templates
2. Click "Create template"
3. Configure:
   - **Template name**: `VerificationCode`
   - **Subject**: `Your Verification Code`
   - **HTML body**:
   ```html
   <!DOCTYPE html>
   <html>
   <body>
       <h2>Your Verification Code</h2>
       <p>Your verification code is: <strong>{{code}}</strong></p>
       <p>This code will expire in 30 minutes.</p>
       <p>If you didn't request this code, please ignore this email.</p>
   </body>
   </html>
   ```
   - **Text body**:
   ```
   Your Verification Code
   
   Your verification code is: {{code}}
   
   This code will expire in 30 minutes.
   
   If you didn't request this code, please ignore this email.
   ```
4. Click "Create template"

**Via AWS CLI:**
```bash
aws ses create-template \
    --region eu-west-2 \
    --cli-input-json '{
  "Template": {
    "TemplateName": "VerificationCode",
    "SubjectPart": "Your Verification Code",
    "HtmlPart": "<!DOCTYPE html><html><body><h2>Your Verification Code</h2><p>Your verification code is: <strong>{{code}}</strong></p><p>This code will expire in 30 minutes.</p><p>If you didn'\''t request this code, please ignore this email.</p></body></html>",
    "TextPart": "Your Verification Code\n\nYour verification code is: {{code}}\n\nThis code will expire in 30 minutes.\n\nIf you didn'\''t request this code, please ignore this email."
  }
}'
```

#### C. Create Email Template: CompanyEmail

**Via AWS Console:**
1. Go to AWS Console → Amazon SES → Email templates
2. Click "Create template"
3. Configure:
   - **Template name**: `CompanyEmail`
   - **Subject**: `Data Removal Request`
   - **HTML body**:
   ```html
   <!DOCTYPE html>
   <html>
   <body>
       <p>Dear {{companyName}},</p>
       
       <p>I am writing to request the removal of my personal information from your database in accordance with applicable data privacy laws.</p>
       
       <p><strong>My Information:</strong></p>
       <ul>
           <li>Name: {{name}}</li>
           <li>Address: {{street}}, {{city}}, {{postcode}}, {{country}}</li>
           <li>Email: {{email}}</li>
       </ul>
       
       <p>Please confirm receipt of this request and provide information about the removal process and timeline.</p>
       
       <p>Thank you for your prompt attention to this matter.</p>
       
       <p>Sincerely,<br>{{name}}</p>
   </body>
   </html>
   ```
   - **Text body**:
   ```
   Dear {{companyName}},
   
   I am writing to request the removal of my personal information from your database in accordance with applicable data privacy laws.
   
   My Information:
   - Name: {{name}}
   - Address: {{street}}, {{city}}, {{postcode}}, {{country}}
   - Email: {{email}}
   
   Please confirm receipt of this request and provide information about the removal process and timeline.
   
   Thank you for your prompt attention to this matter.
   
   Sincerely,
   {{name}}
   ```
4. Click "Create template"

**Via AWS CLI:**
```bash
aws ses create-template \
    --region eu-west-2 \
    --cli-input-json '{
  "Template": {
    "TemplateName": "CompanyEmail",
    "SubjectPart": "Data Removal Request",
    "HtmlPart": "<!DOCTYPE html><html><body><p>Dear {{companyName}},</p><p>I am writing to request the removal of my personal information from your database in accordance with applicable data privacy laws.</p><p><strong>My Information:</strong></p><ul><li>Name: {{name}}</li><li>Address: {{street}}, {{city}}, {{postcode}}, {{country}}</li><li>Email: {{email}}</li></ul><p>Please confirm receipt of this request and provide information about the removal process and timeline.</p><p>Thank you for your prompt attention to this matter.</p><p>Sincerely,<br>{{name}}</p></body></html>",
    "TextPart": "Dear {{companyName}},\n\nI am writing to request the removal of my personal information from your database in accordance with applicable data privacy laws.\n\nMy Information:\n- Name: {{name}}\n- Address: {{street}}, {{city}}, {{postcode}}, {{country}}\n- Email: {{email}}\n\nPlease confirm receipt of this request and provide information about the removal process and timeline.\n\nThank you for your prompt attention to this matter.\n\nSincerely,\n{{name}}"
  }
}'
```

#### D. Move Out of Sandbox (Production Only)

For development, SES sandbox mode is fine. For production:

1. Go to AWS Console → Amazon SES → Account dashboard
2. Click "Request production access"
3. Fill out the form explaining your use case
4. Wait for AWS approval (usually 24-48 hours)

### 1.3 Set Up IAM Permissions

Your application needs IAM permissions to access SES and DynamoDB.

**Create IAM Policy:**
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
      "Resource": "arn:aws:dynamodb:eu-west-2:YOUR_ACCOUNT_ID:table/data-broker-remover-users"
    }
  ]
}
```

**Attach to Your Application's IAM Role:**
1. Go to AWS Console → IAM → Roles
2. Find your application's role (e.g., Lambda execution role, EC2 instance role, or ECS task role)
3. Click "Add permissions" → "Create inline policy"
4. Paste the policy above
5. Replace `YOUR_ACCOUNT_ID` with your AWS account ID
6. Click "Review policy" → Name it "DataBrokerRemoverPolicy" → "Create policy"

## Step 2: Add Environment Variables

### 2.1 Create Data Broker Email List

You need to compile a list of data broker companies and their contact emails in this format:

```
CompanyName1,email1@domain.com:CompanyName2,email2@domain.com:CompanyName3,email3@domain.com
```

**Example:**
```
BidSwitch,privacy@bidswitch.com:VUUKLE,support@vuukle.com:Bookyourdata,optout@bookyourdata.com
```

### 2.2 Add to Environment File

Create or update `apps/frontend/.env.local`:

```bash
# AWS Region
VITE_AWS_REGION=eu-west-2

# DynamoDB Table Name
VITE_TABLE_NAME=data-broker-remover-users

# Data Broker Companies (Name,Email:Name,Email:...)
VITE_COMPANIES=BidSwitch,privacy@bidswitch.com:VUUKLE,support@vuukle.com:Bookyourdata,optout@bookyourdata.com:Censia,contact@censia.com:Diligent,privacy@diligent.com:EproDirect,optout@eprodirect.com

# Add more data brokers as needed...
```

**Important Notes:**
- No spaces between entries
- Use `:` to separate companies
- Use `,` to separate name from email
- Keep all on one line

### 2.3 Add AWS Credentials (Local Development)

For local development, ensure AWS credentials are configured:

**Option 1: AWS CLI Configuration**
```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter default region: eu-west-2
# Enter default output format: json
```

**Option 2: Environment Variables**
Add to `apps/frontend/.env.local`:
```bash
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=eu-west-2
```

## Step 3: Test the Setup

### 3.1 Verify AWS Configuration

**Test DynamoDB:**
```bash
aws dynamodb describe-table \
    --table-name data-broker-remover-users \
    --region eu-west-2
```

**Test SES Templates:**
```bash
# List templates
aws ses list-templates --region eu-west-2

# Get specific template
aws ses get-template \
    --template-name VerificationCode \
    --region eu-west-2
```

**Test SES Send (in sandbox, use verified email):**
```bash
aws ses send-email \
    --from noreply@visiblelabs.org \
    --to your-verified-email@example.com \
    --subject "Test" \
    --text "Test email" \
    --region eu-west-2
```

### 3.2 Start Development Server

```bash
cd apps/frontend
pnpm dev
```

### 3.3 Test the Tool

1. Navigate to `https://localhost:3000/tools/data-broker-remover`
2. Enter a verified email address (in SES sandbox mode)
3. Complete the verification flow
4. Test the email sending

## Troubleshooting

### Issue: "Email address is not verified"
**Solution:** In SES sandbox mode, both sender AND recipient emails must be verified. Verify your test email in SES.

### Issue: "Table does not exist"
**Solution:** Check the table name in your `.env.local` matches the table name in DynamoDB.

### Issue: "Access Denied"
**Solution:** Check IAM permissions are correctly configured for your application's role.

### Issue: "Template not found"
**Solution:** Verify email templates are created in the correct AWS region.

## Production Deployment

When deploying to production:

1. ✅ Move SES out of sandbox mode
2. ✅ Use production DynamoDB table
3. ✅ Set up CloudWatch monitoring
4. ✅ Configure production environment variables
5. ✅ Test with real data broker emails
6. ✅ Set up error alerting

## Security Checklist

- [ ] AWS credentials are stored securely (not in code)
- [ ] DynamoDB table has appropriate access controls
- [ ] SES sending limits are configured
- [ ] CloudWatch logs are enabled for debugging
- [ ] Rate limiting is working (45-day cooldown)
- [ ] Email addresses are being hashed before storage

## Support

If you encounter issues:
1. Check AWS CloudWatch logs for errors
2. Verify environment variables are loaded correctly
3. Test AWS services independently
4. Review the main README.md for additional context

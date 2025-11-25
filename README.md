# Data Broker Remover Tool

A Next.js application that generates and sends removal request emails to data brokers. Built with Next.js 16, React 19, and AWS services.

## 🎯 What it Does

This tool helps you request the removal of your personal information from data broker databases by:
1. Verifying your email address
2. Collecting your information (name, address)
3. Automatically sending removal requests to 60+ data brokers
4. CC'ing you on all emails for transparency

## 🚀 Quick Start

### Prerequisites

- Node.js 22 or higher
- AWS Account with SES and DynamoDB access
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/visible-cx/databroker_remover.git
cd databroker_remover

# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env.local

# Configure AWS services (see Setup Guide below)
```

### Running Locally

```bash
pnpm dev
```

Visit `http://localhost:3000`

## ⚙️ AWS Setup

### 1. Create DynamoDB Table

```bash
aws dynamodb create-table \
    --table-name data-broker-remover-users \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region eu-west-2
```

### 2. Set Up SES Email Templates

**Verify sender emails:**
```bash
aws ses verify-email-identity --email-address noreply@yourdomain.com --region eu-west-2
aws ses verify-email-identity --email-address requests@yourdomain.com --region eu-west-2
```

**Create VerificationCode template:**
```bash
aws ses create-template --region eu-west-2 --cli-input-json '{
  "Template": {
    "TemplateName": "VerificationCode",
    "SubjectPart": "Your Verification Code",
    "HtmlPart": "<!DOCTYPE html><html><body><h2>Your Verification Code</h2><p>Your verification code is: <strong>{{code}}</strong></p><p>This code will expire in 30 minutes.</p></body></html>",
    "TextPart": "Your verification code is: {{code}}\n\nThis code will expire in 30 minutes."
  }
}'
```

**Create CompanyEmail template:**
```bash
aws ses create-template --region eu-west-2 --cli-input-json '{
  "Template": {
    "TemplateName": "CompanyEmail",
    "SubjectPart": "Data Removal Request",
    "HtmlPart": "<!DOCTYPE html><html><body><p>Dear {{companyName}},</p><p>I am writing to request the removal of my personal information from your database.</p><p><strong>My Information:</strong></p><ul><li>Name: {{name}}</li><li>Address: {{street}}, {{city}}, {{postcode}}, {{country}}</li><li>Email: {{email}}</li></ul><p>Please confirm receipt of this request.</p><p>Sincerely,<br>{{name}}</p></body></html>",
    "TextPart": "Dear {{companyName}},\n\nI am writing to request the removal of my personal information from your database.\n\nMy Information:\n- Name: {{name}}\n- Address: {{street}}, {{city}}, {{postcode}}, {{country}}\n- Email: {{email}}\n\nPlease confirm receipt of this request.\n\nSincerely,\n{{name}}"
  }
}'
```

### 3. Configure Environment Variables

Edit `.env.local`:

```bash
# AWS Configuration
VITE_AWS_REGION=eu-west-2
VITE_TABLE_NAME=data-broker-remover-users

# Data Broker Email List
VITE_COMPANIES=BrokerName1,email1@domain.com:BrokerName2,email2@domain.com

# AWS Credentials (local dev only)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

### 4. IAM Permissions

Your application needs these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["ses:SendTemplatedEmail", "ses:SendBulkTemplatedEmail"],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": ["dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:UpdateItem"],
      "Resource": "arn:aws:dynamodb:REGION:ACCOUNT:table/data-broker-remover-users"
    }
  ]
}
```

## 🔒 Privacy & Security

- **Email Hashing**: Email addresses are hashed (SHA256) before storage
- **No Personal Data Storage**: User details (name, address) are only used to generate emails and never stored
- **Rate Limiting**: Users can only send requests once every 45 days
- **Open Source**: Fully auditable code

## 📦 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Add environment variables in Vercel dashboard.

### Docker

```bash
# Build image
docker build -t databroker-remover .

# Run container
docker run -p 3000:3000 --env-file .env.local databroker-remover
```

### Other Platforms

Compatible with any Next.js hosting platform:
- AWS Amplify
- Netlify
- Railway
- Fly.io

## 🛠️ Development

### Project Structure

```
.
├── app/                    # Next.js pages
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── data-broker-remover/  # Tool components
├── lib/                   # Utilities
│   └── data-broker-remover/  # AWS clients, types
└── actions/               # Server Actions
    └── data-broker-remover/  # API handlers
```

### Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **AWS Services**: SES (emails), DynamoDB (storage)

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a PR.

## ⚠️ Troubleshooting

**"Email address not verified"**
- In SES sandbox mode, both sender and recipient must be verified

**"Table does not exist"**
- Check table name in `.env.local` matches DynamoDB table

**"Access Denied"**
- Verify IAM permissions are correctly configured

## 📚 Additional Resources

- [AWS SES Documentation](https://docs.aws.amazon.com/ses/)
- [DynamoDB Developer Guide](https://docs.aws.amazon.com/dynamodb/)
- [Next.js Documentation](https://nextjs.org/docs)

## 💬 Support

- [Issues](https://github.com/visible-cx/databroker_remover/issues)
- [Discussions](https://github.com/visible-cx/databroker_remover/discussions)

---

Built by [Visible](https://www.visible.cx) | [Website](https://www.visible.cx) | [Community](https://www.visible.cx/join)

# Data Broker Remover Tool

This is a tool to generate and send emails to data brokers to remove your details.

## How to use

1. Visit remover.visiblelabs.org
2. Enter your email & verify it via the code
3. Enter your details to generate the email templates
4. Click send

## How it works

1. Once you enter your details it generates the email template to be sent via SES
2. Only your email is stored for 45 days, this is to prevent people using this tool to spam data brokers
3. The reply to email is your email address so data brokers will reply to you directly confirming their actions.

## Deploy Your Own

It's open source so you can deploy and run it yourself if you wish.

1. Run `yarn install`
2. Create env file using the example
3. Run `yarn run dev` for the development server 


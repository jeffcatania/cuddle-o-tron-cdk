# Welcome to Pet Cuddle-o-tron CDK project

This project is a Typescript CDK implementation of Adrian Cantrill's [aws-serverless-pet-cuddle-o-tron](https://github.com/acantril/learn-cantrill-io-labs/tree/master/aws-serverless-pet-cuddle-o-tron). If you are new to learning AWS, I cannot recommend his [Solution Architect Associate course](https://learn.cantrill.io/) enough.

The purpose of this repo is to codify the skills that I've learned from the course, learn CDK, and serve as a template for similar architectures.

The `cdk.json` file tells the CDK Toolkit how to execute the app.

## Architecture

The architecture of the project will follow the architecture of Adrian's lesson.
![End State Architecture](ARCHITECTURE-ENDSTATE.png)

# Steps to install and deploy code

0. [Install CDK](https://docs.aws.amazon.com/cdk/v2/guide/cli.html) and run `cdk bootstrap` to setup your cdk environment if you haven't already.
1. Rename `.env.example` to `.env` to enable dotenv environment variables
2. Update environment variables in `.env` file for your configuration.
3. Run `cdk synth` to generate the CloudFormation files in `cdk.out` directory. Inspect files created.
4. Run `cdk deploy` to deploy changes to your AWS environment.
5. Log into the AWS console and view the created CuddleOTron stack in the CloudFormation tab.
6. Once deployed, go to the S3 console to open the Index.html file in your browser. Fill out the form using the SES_VERIFIED_RECEIVER_EMAIL you configured in the `.env` file.
7. Watch the process run in the Step Functions tab.  Validate if theres any errors.
8. Check your RECEIVER email address.  You should have an email.  If its not there, check your spam folder.

## Steps to Boostrap a new AWS CLI
  
## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `npm run test-coverage` perform the jest unit tests with code coverage report
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template


## AWS Multi-Account Boostrapping
By default, the AWS CLI will have you log into your AWS account which presumably has the right IAM permissions to run CDK bootstrap. This should work if you are just setting this up for a single account that you control. But I wanted an easier way to provision CDK deployment accounts on DEV, STAGING, and PROD AWS accounts. The below steps show you how to setup a DEV account. Repeat the steps for STAGING and PROD accounts. 

### Setting up a new CUDDLE-DEV AWS Account
#### Setup AWS Organization
1. Log into the AWS console using your general management account
2. Go to the AWS Organizations Tab
3. If you do not currently have an Organization setup, use the AWS Organization wizard to create a new Organization.  For more info, check out [acantrill's tutorial videos](https://learn.cantrill.io/courses/aws-certified-solutions-architect-associate-saa-c03/lectures/41301370).
#### Setup AWS Account
4. From the AWS Accounts page of the AWS Organizations Service, click the "Add an AWS Account".
5. From the Add an AWS Account page, enter in the AWS account name `CUDDLE-DEV`.  Use a unique email address for the account owner such as `youraccount+cuddles-dev@gmail.com`. Keep the IAM Role name as `OrganizationAccountAccessRole`. Click Create Account.
#### Setup Role Switching for AWS Console
6. Copy the 12-digit AWS Account ID from the AWS account page for the newly created `CUDDLE-DEV` account.
7. Once the account has been created, click on the AWS account dropdown menu from the very top right of the screen `iamadmin@myaccountname-aws-general`. At the very bottom, next to the Sign Out button, click `Switch role`. 
8. On the Switch Role page, past the 12-digit AWS Account ID in the Account Field.  Enter `OrganizationAccountAccessRole` as the Role. And display name should be `CUDDLE-DEV`. Choose the Green color for DEV.
#### Create CDK IAM Deployment Account for Boostrap
9. Your account should have assumed the `CUDDLE-DEV` role as indicated by the symbol next to your login name in the top right.  If its not, Role Switch to your `CUDDLE-DEV` account by clicking the Account menu from the top right and clicking `CUDDLE-DEV` from "Role History".
10. Open CloudFormation and the Stacks menu.
11. Click Create Stack (with new resources).
12. Under specify template, select `Upload a template file`.  Upload the [CDK IAM Boostrap Cloudformation Template](./resources/iam-policies/cdk-bootstrap-policy.cloudformation.json). This template creates an IAM Group `CDKDeploymentGroup` with the right permissions CDK requires to run the CDK bootstrap operation.  It also includes two users: `CDKDeploymentUser` (for local AWS CLI) and `CDKGitHubActionUser` (for deployment for GitHub Action).
13. For Stack Name, enter `cdk-iam-boostrap-stack`. Click Next and then click through the rest of the menus until you are able to Submit. Wait for the stack to complete.
#### Attach Account Access Key to AWS CLI
14. Open the IAM console. Navigate to the Users tab. Click into the `CDKDeploymentUser`.
15. Click the Security Credentials Menu, and navigate to the Access Keys section.
16. Click Create Access Key.
17. Click Command Line Interface (CLI) option.
18. Click Create access Key.  You should see the Access Keys on the page for this account.
19. In your terminal, open ~/.aws/credentials file.
20. Add a new section for the cuddle-dev.
```
[cuddle-dev]
aws_access_key_id = YOUR-ACCESS-KEY
aws_secret_access_key = YOUR-SECRET-ACCESS-KEY
```
21. Now you have the AWS credential installed, you should be able to run CDK bootstrap.
`cdk boostrap --profile cuddle-dev aws://{YOUR-12-DIGIT-AWS-ACCOUNT-ID}/us-east-1`

#### Setup Github Actions Secrets
22. Open the IAM console. Navigate to the Users tab. Click into the `CDKGitHubActionUser`.
23. Click the Security Credentials Menu, and navigate to the Access Keys section.
24. Click Create Access Key.
25. Click Command Line Interface (CLI) option.
26. Click Create access Key.  You should see the Access Keys on the page for this account.
27. On GitHub, navigate to the `Settings` -> `Secrets and Variables` menu of this repo. 
28. Click "Manage Environment", then "Create Environment". 
29. Name the new environment "DEV'. 
30. Add your AWS access credentials from the CDKGitHubActionUser account as new environment secrets. 
```
AWS_ACCESS_KEY_ID = {CDKGitHubActionUser_ACCESS_KEY_ID}
AWS_SECRET_ACCESS_KEY = {CDKGitHubActionUser_SECRET_ACCESS_KEY_ID}
```
31. Add your environnment variables
```
SES_VERIFIED_RECEIVER_EMAIL = {an email address you want SES emails to be sent to}
SES_VERIFIED_SENDER_EMAIL = {an email address you want SES emails to be sent from}
``` 

## Non Functional Features

I am using the project as a testing ground for good code hygiene practices as I intend to use this as a basis for future AWS projects.

- Running CDK using Typescript
- Automated testing using Jest and the CDK Template framework. Aiming for 75% code coverage.
- Automated Code Linting with [Prettier](https://prettier.io/docs/en/precommit.html) via git pre-commit hook.
- GitHub action for CI.

## TODO
* Write integration tests for each stage of the pipeline.
* Refactor Email Reminder Construct file to seperate files.
* Add CD to GitHub Action.
* Migrate Lambda code from Python to Typescript for consistency. Include unit tests.
* Add code generators for new initializing new constructs, s3, and lambdas. (I like hygen)
* Templatize this whole codebase for use in future projects.

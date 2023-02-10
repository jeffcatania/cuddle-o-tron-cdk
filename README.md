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

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `npm run test-coverage` perform the jest unit tests with code coverage report
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template

## Non Functional Requirements

I am using the project as a testing ground for good code hygiene practices as I intend to use this as a basis for future AWS projects.

- Running CDK using Typescript
- Automated testing using Jest and the CDK Template framework. Aiming for 75% code coverage.
- Automated Code Linting with [Prettier](https://prettier.io/docs/en/precommit.html) via git pre-commit hook.

I'd love to also include mocking and runners for Lambda functions and integration tests, but that will come later.

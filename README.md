# Welcome to Pet Cuddle-o-tron CDK project

This project is a Typescript CDK implementation of Adrian Cantrill's [aws-serverless-pet-cuddle-o-tron](https://github.com/acantril/learn-cantrill-io-labs/tree/master/aws-serverless-pet-cuddle-o-tron).

The purpose of this repo is to codify the skills that I've learned from the course, learn CDK, and serve as a template for similar architectures.

The `cdk.json` file tells the CDK Toolkit how to execute the app.

## Architecture

The architecture of the project will follow the architecture of Adrian's lesson. 
![End State Architecture](ARCHITECTURE-ENDSTATE.png)

# Steps to run
0. [Install CDK](https://docs.aws.amazon.com/cdk/v2/guide/cli.html) and run `cdk bootstrap` to setup your cdk environment if you haven't already.
1. Rename `.env.example` to `.env` to enable dotenv environment variables
2. Update environment variables in `.env` file for your configuration.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
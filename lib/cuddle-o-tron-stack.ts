import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import { VerifySesEmailAddress } from '@seeebiii/ses-verify-identities';

export class CuddleOTronStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const emailAddress = new VerifySesEmailAddress(this, 'SesEmailVerification', {
      emailAddress: 'hello@example.org'
    })
    // example resource
    // const queue = new sqs.Queue(this, 'CuddleOTronQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}

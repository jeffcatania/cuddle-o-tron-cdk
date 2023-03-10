import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import { VerifySesEmailAddress } from "@seeebiii/ses-verify-identities";
import { RemovalPolicy } from "aws-cdk-lib";
import { EmailReminderConstruct } from "./email-reminder-construct";

export class CuddleOTronStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new VerifySesEmailAddress(this, "SesVerifiedSenderEmail", {
      emailAddress: process.env.SES_VERIFIED_SENDER_EMAIL as string,
      removalPolicy: RemovalPolicy.RETAIN,
    });

    new VerifySesEmailAddress(this, "SesVerifiedReceiverEmail", {
      emailAddress: process.env.SES_VERIFIED_RECEIVER_EMAIL as string,
      removalPolicy: RemovalPolicy.RETAIN,
    });

    const emailReminderConstruct = new EmailReminderConstruct(
      this,
      "EmailReminderService",
      {}
    );
  }
}

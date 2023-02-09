import { aws_lambda as lambda, aws_iam as iam } from "aws-cdk-lib";
import { Effect } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import path = require("path");
import { PROJECT_ROOT_PATH } from "./util/environment";

export interface EmailReminderLambdaConstructProps {
  prefix?: string;
}

export class EmailReminderLambdaConstruct extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: EmailReminderLambdaConstructProps = {}
  ) {
    super(scope, id);

    const lambdaRole = new iam.Role(this, "LambdaRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      description:
        "Execution role for Lambda function to allow access to SES, SNS, State Machine, and Cloudwatch",
      inlinePolicies: {
        snsandsespermissions: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              actions: ["ses:*", "sns:*", "states:*"],
              resources: ["*"],
              effect: Effect.ALLOW,
            }),
          ],
        }),
        cloudwatchlogs: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              actions: ["cloudwatch:*"],
              resources: ["*"],
              effect: Effect.ALLOW,
            }),
          ],
        }),
      },
    });

    const fn = new lambda.Function(this, "MyFunction", {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: "lambda.handler",
      code: lambda.Code.fromAsset(
        path.join(PROJECT_ROOT_PATH, "resources", "lambda", "email-reminder")
      ),
      role: lambdaRole,
      environment: {
        FROM_EMAIL_ADDRESS: process.env.SES_VERIFIED_SENDER_EMAIL as string,
        ENV: "dev",
      },
    });

    /* 
      const bucket = new s3.Bucket(this, 'bucket');
      const topic = new sns.Topic(this, 'topic');
      bucket.addObjectCreatedNotification(new s3notify.SnsDestination(topic),
        { prefix: props.prefix });
        */
  }
}

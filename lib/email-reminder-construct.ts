import {
  aws_lambda as lambda,
  aws_iam as iam,
  aws_stepfunctions as sfn,
  aws_stepfunctions_tasks as tasks,
  aws_apigateway as apigateway,
  Duration,
} from "aws-cdk-lib";
import { Effect } from "aws-cdk-lib/aws-iam";
import { LogGroup, LogStream } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";
import path = require("path");
import { PROJECT_ROOT_PATH } from "./util/environment";

export interface EmailReminderLambdaConstructProps {
  prefix?: string;
}

export class EmailReminderConstruct extends Construct {
  lambdaFn: lambda.Function;
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
              actions: ["cloudwatch:*", "logs:*"],
              resources: ["*"],
              effect: Effect.ALLOW,
            }),
          ],
        }),
      },
    });

    const stateMachineRole = new iam.Role(this, "StateMachineRole", {
      assumedBy: new iam.ServicePrincipal("states.amazonaws.com"),
      description:
        "Execution role for StateMachine to allow access to SES, SNS, State Machine, and Cloudwatch",
      inlinePolicies: {
        snsandsespermissions: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              actions: ["lambda:InvokeFunction", "sns:*"],
              resources: ["*"],
              effect: Effect.ALLOW,
            }),
          ],
        }),
        cloudwatchlogs: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              actions: [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
                "logs:CreateLogDelivery",
                "logs:GetLogDelivery",
                "logs:UpdateLogDelivery",
                "logs:DeleteLogDelivery",
                "logs:ListLogDeliveries",
                "logs:PutResourcePolicy",
                "logs:DescribeResourcePolicies",
                "logs:DescribeLogGroups",
              ],
              resources: ["*"],
              effect: Effect.ALLOW,
            }),
          ],
        }),
      },
    });

    const emailLambdaFunction = new lambda.Function(this, "MyFunction", {
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

    const asl = {
      Comment: "Pet Cuddle-o-Tron - using Lambda for email.",
      StartAt: "Timer",
      States: {
        Timer: {
          Type: "Wait",
          SecondsPath: "$.waitSeconds",
          Next: "Email",
        },
        Email: {
          Type: "Task",
          Resource: "arn:aws:states:::lambda:invoke",
          Parameters: {
            FunctionName: emailLambdaFunction.functionArn,
            Payload: {
              "Input.$": "$",
            },
          },
          Next: "NextState",
        },
        NextState: {
          Type: "Pass",
          End: true,
        },
      },
    };

    const logGroup = new LogGroup(
      this,
      "Email Reminder State Machine Log Group"
    );
    const loggingConfigurationProperty: sfn.CfnStateMachine.LoggingConfigurationProperty =
      {
        destinations: [
          {
            cloudWatchLogsLogGroup: {
              logGroupArn: logGroup.logGroupArn,
            },
          },
        ],
        includeExecutionData: true,
        level: "ALL",
      };

    const stateMachine = new sfn.CfnStateMachine(this, "PetCuddleOTron", {
      roleArn: stateMachineRole.roleArn,
      definitionString: JSON.stringify(asl),
      loggingConfiguration: loggingConfigurationProperty,
    });

    const handleAPIRequestFunction = new lambda.Function(
      this,
      "HandleAPIRequestLambda",
      {
        runtime: lambda.Runtime.PYTHON_3_9,
        handler: "lambda.handler",
        code: lambda.Code.fromAsset(
          path.join(
            PROJECT_ROOT_PATH,
            "resources",
            "lambda",
            "handle-api-request"
          )
        ),
        role: lambdaRole,
        environment: {
          STATE_MACHINE_ARN: stateMachine.attrArn,
          ENV: "dev",
        },
      }
    );

    const api = new apigateway.RestApi(this, "petcuddleotron", {
      endpointTypes: [apigateway.EndpointType.REGIONAL],
    });

    const petCuddleotronResource = api.root.addResource("petcuddleotron", {
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    petCuddleotronResource.addMethod(
      "POST",
      new apigateway.LambdaIntegration(handleAPIRequestFunction, {
        proxy: true,
        timeout: Duration.seconds(3),
      })
    );
  }
}

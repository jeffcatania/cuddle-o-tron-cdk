import * as cdk from "aws-cdk-lib";
import { Match, Template } from "aws-cdk-lib/assertions";
import * as CuddleOTron from "../lib/cuddle-o-tron-stack";

// example test. To run these tests, uncomment this file along with the
// example resource in lib/cuddle-o-tron-stack.ts
describe("Email reminder service", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new CuddleOTron.CuddleOTronStack(app, "MyTestStack");
  // THEN
  const template = Template.fromStack(stack);

  test("should initialize lambda execution role", () => {
    template.hasResourceProperties("AWS::IAM::Role", {
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "lambda.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      ManagedPolicyArns: [
        {
          "Fn::Join": [
            "",
            [
              "arn:",
              {
                Ref: "AWS::Partition",
              },
              ":iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
            ],
          ],
        },
      ],
    });
  });

  test("should initialize a lambda", () => {
    template.hasResourceProperties("AWS::Lambda::Function", {
      Runtime: "python3.9",
      Handler: "lambda.handler",
    });
  });

  test("should initialize state machine", () => {
    template.hasResourceProperties("AWS::StepFunctions::StateMachine", {});
  });
});

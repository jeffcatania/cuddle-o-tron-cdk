#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { CuddleOTronStack } from "../lib/cuddle-o-tron-stack";
import { PROJECT_ROOT_PATH } from "../lib/util/environment";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

// Setup DotEnv
dotenv.config();
const result = dotenv.config();

if (result.error) {
  throw result.error;
}

console.log("loaded environment variables:", result.parsed);
console.log("project root path:", PROJECT_ROOT_PATH);

const app = new cdk.App();
new CuddleOTronStack(app, "CuddleOTronStack", {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */
  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },
  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});

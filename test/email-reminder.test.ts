import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as CuddleOTron from '../lib/cuddle-o-tron-stack';

// example test. To run these tests, uncomment this file along with the
// example resource in lib/cuddle-o-tron-stack.ts
describe('Email reminder service', () => {
   const app = new cdk.App();
   // WHEN
   const stack = new CuddleOTron.CuddleOTronStack(app, 'MyTestStack');
    // THEN
   const template = Template.fromStack(stack);

    test('should initialize a lambda', () => {
        template.hasResourceProperties('AWS::Lambda::Function', {
            'Runtime': 'python3.9',
            'Handler': 'lambda.handler'
        })
    })

   //test('receiver identity created', () => {
   // template.hasResourceProperties('Custom::AWS', {
   //     Create: '{"service":"SES","action":"verifyEmailIdentity","parameters":{"EmailAddress":"to@example.com"},"physicalResourceId":{"id":"verify-to@example.com"}}'
   // })
   //})

});

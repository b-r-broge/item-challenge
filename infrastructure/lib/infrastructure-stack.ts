import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // Define lambda functions
    const createItemLambda = new lambda.Function(this, 'CreateItemHandler', {
      runtime: lambda.Runtime.NODEJS_24_X,
      handler: 'index.createItemHandler',
      code: lambda.Code.fromAsset('../dist/handlers'),
    });

    const getItemLambda = new lambda.Function(this, 'GetItemHandler', {
      runtime: lambda.Runtime.NODEJS_24_X,
      handler: 'index.getItemHandler',
      code: lambda.Code.fromAsset('../dist/handlers'),
    });

    const updateItemLambda = new lambda.Function(this, 'UpdateItemHandler', {
      runtime: lambda.Runtime.NODEJS_24_X,
      handler: 'index.updateItemHandler',
      code: lambda.Code.fromAsset('../dist/handlers'),
    });

    // Define API Gateway REST API
    const api = new apigw.RestApi(this, 'ExamItemsApi', {
      restApiName: 'Exam Items Service',
      description: 'This service manages exam items.',
    });

    // Create Lambda integrations
    const createItemIntegration = new apigw.LambdaIntegration(createItemLambda);
    const getItemIntegration = new apigw.LambdaIntegration(getItemLambda);
    const updateItemIntegration = new apigw.LambdaIntegration(updateItemLambda);

    // Add resources and methods to the API
    const itemsResource = api.root.addResource('api').addResource('items');
    itemsResource.addMethod('POST', createItemIntegration); // POST /items

    const itemIdResource = itemsResource.addResource('{id}');
    itemIdResource.addMethod('GET', getItemIntegration); // GET /items/{id}
    itemIdResource.addMethod('PUT', updateItemIntegration); // PUT /items/{id}

    // Define DynamoDB table
    const table = new dynamodb.TableV2(this, 'ExamItemsTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billing: dynamodb.Billing.onDemand(),
    });

    // Grant Lambda functions permissions to access the DynamoDB table
    table.grants.readWriteData(createItemLambda);
    table.grants.readData(getItemLambda);
    table.grants.readWriteData(updateItemLambda);
  }
}

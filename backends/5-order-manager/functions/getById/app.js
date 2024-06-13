/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

'use strict';

const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");
const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { SFN } = require("@aws-sdk/client-sfn");

const stepFunctions = new SFN({
  region: process.env.AWS_REGION,
})
const documentClient = DynamoDBDocument.from(new DynamoDB())

// Update order
const getOrder = async (record) => {
  const params = {
    TableName: process.env.TableName,
    Key: {
      PK: 'orders',
      SK: record.orderId,
    }
  }
  // console.log(params)
  const result = await documentClient.get(params)
  // console.log(result)

  return {
    orderId: record.orderId,
    drinkOrder: result.Item.drinkOrder,
    orderState: result.Item.ORDERSTATE,
    TS: result.TS
  }
}

// Returns list of open orders, sorted by time
exports.handler = async (event) => {
  console.log(JSON.stringify(event, null, 2))

  const record = {
    orderId: event.pathParameters.id,
    userId: event.requestContext.authorizer.jwt.claims.sub
  }

  const result = await getOrder(record)

  return {
    "statusCode": 200,
    "body": JSON.stringify({ result }),
    "isBase64Encoded": false
  }
}

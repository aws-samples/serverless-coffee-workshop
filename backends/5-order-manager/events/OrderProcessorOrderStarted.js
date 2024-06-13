/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

'use strict';

const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");
const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { SFN } = require("@aws-sdk/client-sfn");

const documentClient = DynamoDBDocument.from(new DynamoDB())
const stepFunctions = new SFN({
  region: process.env.AWS_REGION,
})

// Returns details of a Place ID where the app has user-generated content.
exports.handler = async (event) => {
  console.log(JSON.stringify(event, null, 2))

  const params = {
    TableName: process.env.TableName,
    Key: {
      PK: 'orders',
      SK: event.detail.orderId,
    },
    UpdateExpression: "set drinkOrder = :drinkOrder, TS = :TS",
    ConditionExpression: "#userId = :userId",
    ExpressionAttributeNames:{
      "#userId": "USERID"
    },
    ExpressionAttributeValues:{
      ":drinkOrder": event.detail.drink,
      ":userId": event.detail.userId,
      ":TS": Date.now()
    },
    ReturnValues: "ALL_NEW"
  }

  console.log(params)
  const result = await documentClient.update(params)
  console.log(result)

  // Update Step Functions workflow
  const sfnParams = {
    taskToken: result.Attributes.TaskToken,
    output: JSON.stringify({'orderId': event.detail.orderId})
  }
  console.log ({ sfnParams })
  const sfnResult = await stepFunctions.sendTaskSuccess(sfnParams)
  console.log({ sfnResult })
}

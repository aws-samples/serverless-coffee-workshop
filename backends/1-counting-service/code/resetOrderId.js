/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");
const { DynamoDB } = require("@aws-sdk/client-dynamodb");

const documentClient = DynamoDBDocument.from(new DynamoDB())

// Reset order ID counter
exports.handler = async (event) => {
  console.log(JSON.stringify(event, null, 2))

  await documentClient.update({
    TableName: process.env.TableName,
    Key: {
      PK: 'orderID'
    },
    UpdateExpression: "set IDvalue = :val",
    ExpressionAttributeValues:{
      ":val": 0
    }
  })
}

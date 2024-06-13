/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */


const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");
const { DynamoDB } = require("@aws-sdk/client-dynamodb");

const documentClient = DynamoDBDocument.from(new DynamoDB())

const getItem = async (id) => {
  const params = {
    TableName: process.env.TableName,
    KeyConditionExpression: "#pk = :pk",
    ExpressionAttributeNames: {
      "#pk": "PK"
    },
    ExpressionAttributeValues: {
      ":pk": id
    }
  }
  console.log('getItem params: ', params)

  try {
    const result = await documentClient.query(params)
    console.log('getItem result: ', result)
    return result
  } catch (err) {
    console.error('getItem error: ', err)
  }
}

const saveItem = async (record) => {
  const Item = {
    PK: record.last_id,
    ...record
  }
  console.log(Item)
  const result = await documentClient.put({
    TableName: process.env.TableName,
    Item
  })
  console.log('saveItem: ', result)
}

const decrementToken = async (record) => {
  const params = {
    TableName: process.env.TableName,
    Key: {
      PK: record.last_id
    },
    UpdateExpression: "set availableTokens = availableTokens - :val",
    ExpressionAttributeValues:{
      ":val": 1
    },
    ReturnValues:"UPDATED_NEW"
  }
  console.log(params)
  const result = await documentClient.update(params)
  console.log('decrementToken: ', result)
}

module.exports = { saveItem, getItem, decrementToken }
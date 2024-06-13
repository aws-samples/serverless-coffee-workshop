const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");
const {
    DynamoDB: dynamodb,
} = require("@aws-sdk/client-dynamodb");

const docClient = DynamoDBDocument.from(new dynamodb());
exports.handler = async (event) => {
    console.log(event)
    const date = new Date().toISOString().slice(0, 10);
    var tableName = "serverlesspresso-metrics-table"
    for (const record of event.Records) {
        const body = JSON.parse(record.body)
        const orderId = body["detail"]["orderId"]
        console.log(orderId)
        const drink = body["detail"]["drinkOrder"]["drink"]
        let transactParams = {
            TransactItems: [
                {
                    Update: {
                        TableName : tableName,
                        Key:{
                            "PK": "Aggregate",
                            "SK": `${date}#TotalSales`
                        },
                        UpdateExpression: "SET #val = if_not_exists(#val, :initial) + :num",
                        ExpressionAttributeNames: {
                            '#val'   : `val`,
                        },                        
                        ExpressionAttributeValues: {
                            ":num": 1,
                            ":initial": 0,
                        }
                    }
                },
                {
                    Update: {
                        TableName : tableName,
                        Key:{
                            "PK": "Aggregate",
                            "SK": `${date}#${drink}`
                        },
                        UpdateExpression: "SET #val = if_not_exists(#val, :initial) + :num",
                        ExpressionAttributeNames: {
                            '#val'   : `val`,
                        },
                        ExpressionAttributeValues: {
                            ":num": 1,
                            ":initial": 0,
                        }
                    }
                }
            ]
        }
    try {
        await docClient.transactWrite(transactParams)
    }
    catch(e) {
        console.log(e)
        throw new Error(e.message)
    }
    }
    const response = {
        statusCode: 200,
        body: JSON.stringify('Executed Publish Metrics'),
    };
    return response;
}
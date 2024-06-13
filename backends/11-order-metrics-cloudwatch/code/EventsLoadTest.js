// Import required AWS SDK clients and commands for Node.js

const { EventBridge } = require("@aws-sdk/client-eventbridge");

var eventbridge = new EventBridge({})

exports.handler = async (event) => {    
    // Get drinks
    const drinks = ["Latte", "Cappuccino", "Espresso"]
    let batchSize = 10
    
    for (let i = 1000; i < 1500; i+=batchSize) {
        var entries = []

        for (let j = 0; j < batchSize; j++) {
            let order = String(i + j)
            console.log(order);
            let drink = drinks[((Math.floor(Math.random() * drinks.length)))]; // random drink

            let entryDetail = JSON.stringify(
                {"Message":"Barista has cancelled or completed the order",
                    "orderId": order,
                    "ORDERSTATE": "Completed",
                    "userId": order,
                    "drinkOrder":{
                      "userId":order,
                      "drink":drink
                    }
                }
            )
            entries.push({
                "Source": "awsserverlessda.serverlesspresso",
                "EventBusName": "Serverlesspresso",
                "DetailType": "OrderManager.WaitingCompletion",
                "Detail": entryDetail
            })

        }

        // Set the parameters
        let params = {
            "Entries": entries
        };

        try {
            const response = await eventbridge.putEvents(params)
            console.log(response)
        } catch (e) {
            console.log(e)
            throw new Error(e.message)
        }
    }

    

    const response = {
        statusCode: 200,
        body: JSON.stringify('Executed Events Load Test'),
    };
    return response;
}
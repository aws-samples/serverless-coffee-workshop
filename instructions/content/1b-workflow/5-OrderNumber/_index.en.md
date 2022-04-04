+++
title = "Adding an order number"
weight = 15
+++

## Overview

* You will modify the workflow and add an order number to each coffee order.
* To do this, you will add a state that increments a counter value in a DynamoDB table and uses this for the current execution.
* You will test the new workflow and see the input and output payloads.

After this section, you will have a workflow that assigns an order number to the order.

## Updating an atomic counter in a DynamoDB table

In this section, you use a DynamoDB integration in Step Functions to increment an atomic counter and use the value as the order number.

### Step-by-step instructions ##

1. Go to the Step Functions console. From the AWS Management Console, select *Services* then select Step Functions under *Application Integration*. **Make sure your region is correct**.

2. From the left-hand menu, select *State machine* and choose **OrderProcessorWorkflow** from the list. Choose **Edit**.

![Choose Edit](../images/se-mod1-open1.png)

3. On the next page, choose **Workflow Studio** to open the workflow in the designer.

4. With the *Actions* tab selected on the left, enter `updateitem` in the search bar. Drag the *Amazon DynamoDB UpdateItem* action from the list to between the *Is capacity available?* and Pass states in the designer.

![Drag UpdateItem to designer](../images/se-mod1-ordernum1.png)

5. With the state selected, the attribute panel on the right shows the configuration for this state. In the *Configuration tab*:
- For *State name*, enter **Generate Order Number**.
- For *API Parameters*, paste the following DynamoDB query:

```
{
  "TableName": "serverlesspresso-counting-table",
  "Key": {
    "PK": {
      "S": "orderID"
    }
  },
  "UpdateExpression": "set IDvalue = IDvalue + :val",
  "ExpressionAttributeValues": {
    ":val": {
      "N": "1"
    }
  },
  "ReturnValues": "UPDATED_NEW"
}
```
![Configure UpdateItem](../images/se-mod1-ordernum2.png)

6. Choose the *Output* tab. Here, you will modify the state's output to include the result from the DynamoDB query:
- Check the box *Transform result with ResultSelector*.
- In the value textbox, enter:

```
{
  "orderNumber.$": "$.Attributes.IDvalue.N"
}
```
- Check the box *Add original input to output using ResultPath*.
- Ensure the dropdown is set to *Combine original input with result*.
- In the value textbox, enter `$.Order.Payload`.

![Drag GetItem to designer](../images/se-mod1-ordernum3.png)

7. Check the Amazon States Language (ASL) definition by choosing the Definition toggle button above the designer. The ASL appears as:

```
{
  "Comment": "A description of my state machine",
  "StartAt": "DynamoDB Get Shop status",
  "States": {
    "DynamoDB Get Shop status": {
      "Type": "Task",
      "Resource": "arn:aws:states:::dynamodb:getItem",
      "Parameters": {
        "TableName": "serverlesspresso-config-table",
        "Key": {
          "PK": {
            "S": "config"
          }
        }
      },
      "ResultPath": "$.GetStore",
      "Next": "Shop Open?"
    },
    "Shop Open?": {
      "Type": "Choice",
      "Choices": [
        {
          "Not": {
            "Variable": "$.GetStore.Item.storeOpen.BOOL",
            "BooleanEquals": true
          },
          "Next": "EventBridge PutEvents"
        }
      ],
      "Default": "ListExecutions"
    },
    "ListExecutions": {
      "Type": "Task",
      "Next": "Is capacity available?",
      "Parameters": {
        "StateMachineArn": "YOUR_STATE_MACHINE_ARN",
        "MaxResults": 100,
        "StatusFilter": "RUNNING"
      },
      "Resource": "arn:aws:states:::aws-sdk:sfn:listExecutions",
      "ResultPath": "$.isCapacityAvailable"
    },
    "Is capacity available?": {
      "Type": "Choice",
      "Choices": [
        {
          "Variable": "$.isCapacityAvailable[20]",
          "IsPresent": true,
          "Next": "EventBridge PutEvents"
        }
      ],
      "Default": "Generate Order Number"
    },
    "Generate Order Number": {
      "Type": "Task",
      "Resource": "arn:aws:states:::dynamodb:updateItem",
      "Parameters": {
        "TableName": "serverlesspresso-counting-table",
        "Key": {
          "PK": {
            "S": "orderID"
          }
        },
        "UpdateExpression": "set IDvalue = IDvalue + :val",
        "ExpressionAttributeValues": {
          ":val": {
            "N": "1"
          }
        },
        "ReturnValues": "UPDATED_NEW"
      },
      "Next": "Pass",
      "ResultPath": "$.Order.Payload",
      "ResultSelector": {
        "orderNumber.$": "$.Attributes.IDvalue.N"
      }
    },
    "EventBridge PutEvents": {
      "Type": "Task",
      "Resource": "arn:aws:states:::events:putEvents.waitForTaskToken",
      "Parameters": {
        "Entries": [
          {
            "Detail": {
              "Message": "Hello from Step Functions!",
              "TaskToken.$": "$$.Task.Token"
            },
            "DetailType": "MyDetailType",
            "EventBusName": "MyEventBusName",
            "Source": "MySource"
          }
        ]
      },
      "End": true
    },
    "Pass": {
      "Type": "Pass",
      "End": true
    }
  }
}
```

8. Choose **Apply and exit**. In the Edit page, choose **Save**.

9. In the *Edit OrderProcessorWorkflow* page, choose **Save**.

10. Choose **Save anyway** in the IAM popup.

## Testing the Step Functions workflow

In this section, you will test the changes to the workflow.

### Step-by-step instructions ###

1. From the previous section, on the page showing the new workflow, choose **Start execution**. In the *Start execution* pop-up, choose **Start execution**.

2. After the execution is finished, the console shows a results page. The left side shows the flow of execution with the green states showing the actual path. Choose the *Generate Order Number* state to show the details on the right side.

![Execution results](../images/se-mod1-ordernum4.png)

3. Choose the *Step output* on the right side to see the output path for the choice state. The JSON output shows an Order attribute with a Payload containing an orderNumber of 1.

4. Choose **Start execution** again and repeat steps 2 and 3. The orderNumber is now 2. Each time you run start another execution, the order number is incremented.

### Recap

- In this section, you add a state transition that assigns a unique, incrementing order number to the execution.
- This increments a value in the counting DynamoDB table and appends the result in the output payload.
- You tested this new feature in the console to see how the order ID increments with each execution.

### Next steps

Next, you'll add a wait condition to the workflow, to wait for the customer to submit their order.
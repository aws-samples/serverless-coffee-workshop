+++
title = "Is the shop open?"
weight = 13
+++

## Overview

* You will modify the workflow to check if the coffee shop is open and take action accordingly.
* You will test the new workflow and see the input and output payloads.

After this section, you will have a workflow that runs based if the shop is open.

## Reset the Step Functions workflow

First, remove the pass state from the workflow that you added in the previous section.

### Step-by-step instructions ##

1. Go to the Step Functions console. From the AWS Management Console, select *Services* then select Step Functions under *Application Integration*. **Make sure your region is correct**.

2. From the left-hand menu, select *State machine* and choose **OrderProcessorWorkflow** from the list. Choose **Edit**.

![Choose Edit](../images/se-mod1-open1.png)

3. On the next page, choose **Workflow Studio** to open the workflow in the designer.

4. Delete the pass state added in the previous section. Click the state in the designer window and then choose **Delete** in the toolbar.

![Delete the pass state](../images/se-mod1-open2.png)

## Querying the DynamoDB table

In this section, you use a direct service integration in Step Functions to query an item from a DynamoDB table.

### Step-by-step instructions ##

1. With the *Actions* tab selected on the left, select *DynamoDB* in the *Database* category. Drag the *DynamoDB GetItem* action from the list to the empty state in the designer.

![Drag GetItem to designer](../images/se-mod1-open3.png)

2. With the state selected, the attribute panel on the right shows the configuration for this state. In the *Configuration tab*:
- For *State name*, enter **DynamoDB Get Shop status**.
- For *API Parameters*, paste the following DynamoDB query:

```
{
  "TableName": "serverlesspresso-config-table",
  "Key": {
    "PK": {
      "S": "config"
    }
  }
}
```
![Drag GetItem to designer](../images/se-mod1-open4.png)

3. Choose the *Output* tab. Here, you will modify the state's output to include the result from the DynamoDB query:
- Check the box *Add original input to output using ResultPath*.
- Ensure *Combine original input with result* is selected in the dropdown, then enter `$.GetStore` in the value textbox.

![Drag GetItem to designer](../images/se-mod1-open5.png)

## Adding branching logic

The workflow must branch logic depending on the value read from the DynamoDB table. In this section, you add the branching logic.

### Step-by-step instructions ##

1. From the *Flow* tab, drag the *Choice* state to under the *DynamoDB GetItem* state.

![Drag GetItem to designer](../images/se-mod1-open6.png)

2. In the *Actions* tab, enter *EventBridge* in the search box to filter for EventBridge actions. Find the PutEvents action and drag to the empty *Rule #1* box under the choice state.

![Drag PutEvents to designer](../images/se-mod1-open7.png)

3. In the *Flow* tab, drag the *Pass* state to the *Default* empty box under the choice state.

![Drag Pass state to designer](../images/se-mod1-open8.png)

4. You have now defined a logic branch where one result routes to EventBridge and the other to the pass state. Next, define the decision logic in the choice state. Click on the choice state to open its attributes in the right side panel. For *Rule #1*, click on the edit icon.

![Edit rule icon](../images/se-mod1-edit-rule.png)

5. Choose **Add conditions**.

![Edit choice state](../images/se-mod1-open9.png)

6. In the *Conditions for rule #1* panel, specify the rule that will determine if the store is closed:
- For *Not*, select **NOT** in the dropdown.
- For *Variable*, enter `$.GetStore.Item.storeOpen.BOOL`. This JSONPath syntax specifies the storeOpen Boolean attribute from the DynamoDB query response.
- For *Operator*, select **is equal to**.
- For *Value*, select **Boolean constant** then select **true** as the value.
- Choose **Save conditions**.

![Edit conditions](../images/se-mod1-open10.png)

7. For *State name*, add `Shop Open?`.

![Edit state name](../images/se-mod1-open11.png)

8. Check the Amazon States Language (ASL) definition by choosing the **Definition** toggle button above the designer. The ASL appears as:

```
{
  "Comment": "A description of my state machine",
  "StartAt": "DynamoDB Get Shop Status",
  "States": {
    "DynamoDB Get Shop Status": {
      "Type": "Task",
      "Resource": "arn:aws:states:::dynamodb:getItem",
      "Parameters": {
        "TableName": "serverlesspresso-workshop-core-2-ConfigTable-UNIQUECODE",
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
          "Next": "PutEvents"
        }
      ],
      "Default": "Pass"
    },
    "PutEvents": {
      "Type": "Task",
      "End": true,
      "Parameters": {
        "Entries": [
          {}
        ]
      },
      "Resource": "arn:aws:states:::aws-sdk:eventbridge:putEvents"
    },
    "Pass": {
      "Type": "Pass",
      "End": true
    }
  }
}
```
9. Choose **Apply and exit**.

![Drag GetItem to designer](../images/se-mod1-open12.png)

10. In the *Edit OrderProcessorWorkflow* page, choose **Save**.

11. In the *IAM role* popup, choose **Save anyway**. The IAM role you are using was deployed in the setup module and has the necessary permissions.

![IAM role warning](../images/iam-role-warning.png)

## Testing the Step Functions workflow

In this section, you will test the new workflow.

### Step-by-step instructions ###

1. From the previous section, on the page showing the new workflow, choose **Start execution**. In the *Start execution* pop-up, choose **Start execution**.

2. After the execution is finished, the console shows a results page. The left side shows the flow of execution with the green states showing the actual path. Choose the *Shop Open?* status to show the details on the right side.

![Execution results](../images/se-mod1-open16.png)

3. Choose the *Step input* on the right side to see the input path for the choice state. In this case, the `storeOpen` attribute is TRUE, causing the choice state to choose the Pass state.

### Recap

- In this section, you created the first choice state in the workflow. This uses an item from a DynamoDB table to determine if the shop is open.
- You tested this in the console and saw how a Boolean value in the configuration changes the path of the workflow.

### Next steps

Next, you'll check store capacity before allowing the order to continue.

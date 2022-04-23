+++
title = "Waiting Completion"
weight = 16
+++
## Overview

The `WaitingCompletion` event is emitted by the `OrderProcessor` workflow built in module 1. At this point in the order, the user has submitted their drink request, the `OrderProcessor` workflow has generated an order number, and is now paused until the barista completes the order. The workflow has emitted a `WaitingCompletion` event, along with a new `TaskToken` which is used to resume the workflow.

You will now create a new rule to route this event to a Lambda function that will update the `serverlesspresso-order-table` with the new `TaskToken`, order number, and order state.

![Execution results](../images/se-mod2-WaitingCompletion1.png)

## Creating the "Waiting Completion" rule

### Step-by-step instructions ##

1. Go to the EventBridge console. From the AWS Management Console, select *Services* then select EventBridge  *Application Integration*. **Make sure your region is correct**.

2. Choose **Rules**. Choose **Create rule**.

3. In Step 1 of the wizard:
- For the Name, enter *WaitingCompletion*.
- For *Event bus*, enter `Serverlesspresso`.
- Choose **Next**.

![Create rule and add name](../images/se-mod2-waitCompletion-step1.png)

4. In Step 2 of the wizard:
- For *Event source*, select **Other**.
- Ignore the *Sample event* panel.
- In the *Event pattern* panel, paste the following:
- Choose **Next**

```
{
  "detail-type": ["OrderProcessor.WaitingCompletion"],
  "source": ["awsserverlessda.serverlesspresso"]
}
```

5. In Step 3 of the wizard:
- In the *Target 1* panel, choose **AWS service**.
- In the *Select a target* dropdown, choose *Lambda*
- In the *Function* dropdown, choose the Serverlesspresso function containing the name `WaitingCompletion`. Tip: You can start typing "WaitingCompletion" into the field to find the function.
- Choose **Next**.

![Select targets panel](../images/se-mod2-waitCompletion-step3.png)

6. In Step 4 of the wizard, choose **Next**.

7. In Step 5 of the wizard, check that the *Define rule detail* panel that the *Event bus* is `Serverlesspresso`. Choose **Create rule**.

## Review the list of rules

In this section, you created 4 EventBridge rules on the Serverlesspresso event bus. On the *Rules* page, change the *Event bus* dropdown to `Serverlesspresso` and verify that you see all 4 new rules listed (in addition to the 4 rules created in the setup process).

![Verify rules](../images/se-mod2-verifyRules.png)

{{% notice tip %}}

If you created a rule on the default bus instead, review the previous steps in this module to add the rules to the custom bus.

{{% /notice %}}
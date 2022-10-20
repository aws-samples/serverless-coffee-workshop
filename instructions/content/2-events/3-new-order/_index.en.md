+++
title = "New Order"
weight = 13
+++
## Overview

Until now, you have manually started the `OrderProcessor` workflow from the [Step Functions console](https://console.aws.amazon.com/states/home).

In production, the workflow is started by an event generated from the *Validator service*. The event is emitted each time a QR code is scanned by a customer.

* You will create a new rule in [Amazon EventBridge](https://aws.amazon.com/eventbridge/) that passes the Validator event to your OrderProcessor workflow.
* You will test the new rule by mocking the event sent from the Validator service.

![Execution results](../images/se-mod2-NewOrder4.png)

## Creating the "New Order" rule

In this section, you will build the rule that listens to the `Validator.NewOrder` event and passes this to the order workflow target.

### Step-by-step instructions ##

1. Go to the EventBridge console. From the AWS Management Console, select *Services* then select EventBridge  *Application Integration*. **Make sure your region is correct**.

2. Choose **Rules**. Choose **Create rule**.

3. In Step 1 of the wizard:
- For the Name, enter *NewOrder*.
- For *Event bus*, enter `Serverlesspresso`.
- Choose **Next**.

![Create rule and add name](../images/se-mod2-newOrder-step1.png)

4. In Step 2 of the wizard:
- For *Event source*, select **Other**.
- Ignore the *Sample event* panel.
- In the *Event pattern* panel, paste the following:
- Choose **Next**

```
{
  "detail-type": ["Validator.NewOrder"],
  "source": ["awsserverlessda.serverlesspresso"]
}
```

5. In Step 3 of the wizard:
- In the *Target 1* panel, choose **AWS service**.
- In the *Select a target* dropdown, choose *Step Functions state machine*
- In the *State machine* dropdown, choose *OrderProcessorWorkflow*. Tip: You can start typing `OrderProcessor` into the search box to find the workflow.
- For *Execution role*, ensure *Create a new role for the specific resource* is selected.
- Choose **Next**.

![Select targets panel](../images/se-mod2-newOrder-step3.png)

6. In Step 4 of the wizard, choose **Next**.

7. In Step 5 of the wizard, check that the *Define rule detail* panel that the *Event bus* is `Serverlesspresso`. Choose **Create rule**.

## Testing the *"New Order"* rule

In this section, you will test the rule that starts the **OrderProcessor** workflow when the *NewOrder* event is emitted.

### Step-by-step instructions ###

From the AWS EventBridge Console, under *Events*:
1. Choose **Event buses**.
2. Choose the **Serverlesspresso** event bus

![Select event bus](../images/se-mod2-newOrder-test1.png)

3. Choose **Send events**
![Select send events](../images/se-mod2-newOrder-test2.png)


4. Check that the *serverlesspresso* event bus is selected
5. Copy the following into the *Event source* input:
```
awsserverlessda.serverlesspresso
```

6. Copy the following into the *Detail type* input:
```
Validator.NewOrder
```

7. Copy the following into the *Event detail* input:
```
{"userId":"1","orderId":"1"}
```

8. Choose *Send*

![Select send events](../images/se-mod2-newOrder-test3.png)


This should create an event ID with a confirmation summary:

![Select send events](../images/se-mod2-newOrder-test4.png)

This starts a new execution in the `OrderProcessor` workflow.

3. From the [AWS Step Functions console](https://console.aws.amazon.com/states/home?#/statemachines), select the *OrderProcessorWorkflow* you created earlier. You will see the most recent execution with the *Status*, *Running*.

![Execution results](../images/se-mod2-NewOrder2.png)

4. Choose the latest execution from the *Name* column. The console shows the *Execution status* of *Running*. The left side shows the flow of execution with the green states showing the actual path. The blue state shows when execution is suspended, pending a callback.

![Execution results](../images/se-mod1-wait11.png)

The new rule has successfully routed the `NewOrder` event to the `OrderProcessor` workflow. In the next step, you create a rule that routes the `WorkflowStarted` event to an [AWS Lambda](https://aws.amazon.com/lambda/) function.

### Recap

- Before this section, the Validator service published events to the custom bus when the QR code is scanned but nothing was subscribed to these events. You created a rule that subscribes to Validator events and routes the traffic to the order workflow.
- To test, instead of scanning a QR code to trigger the Validator service, you mocked an example event and published it to the custom event bus using the CLI.
- You verified that the Validator event triggered the rule and started the workflow.

### Next steps

Next, you'll create an event that the Order Manager microservice uses to persist details of orders.

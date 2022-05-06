+++
title = "Testing"
weight = 18
+++

## Overview

* You will test the workflow with the store open and closed to follow different execution paths through the workflow.
* You will test the store capacity feature by starting multiple executions and observing where the capacity exceeds what the shop can handle.

After this section, you will have a workflow that is ready to support the drink ordering application.

## 1. Testing the workflow with the store open

First, test the workflow with the store open, which is the default state when you run the setup module.

### Step-by-step instructions ##

1. Go to the Step Functions console. From the AWS Management Console, select *Services* then select Step Functions under *Application Integration*. **Make sure your region is correct**.

2. Under *State machines*, select *OrderProcessorWorkflow*. On the page showing the workflow, choose **Start execution**.

3. In the *Start execution* pop-up, enter the following JSON payload, then choose **Start execution**:

```
{
    "detail": {
      "orderId": "1",
      "userId": "testuser"
    }
}
```

4. The *Graph inspector* shows the workflow path taken as a result of the store being open.

![Store is open](../images/se-mod1-testing2.png)

## 2. Testing the workflow with the store closed

The shop's state is stored in the DynamoDB configuration table for the application. The *Is the shop open?* transition checks this value and uses a Step Functions choice state to determine the flow. Here, you will toggle this state and run executions to test the outcome.

### Step-by-step instructions ##

1. Go to the DynamoDB console. From the AWS Management Console, select *Services* then select DynamoDB under *Database*. Make sure your region is correct.

2. From the left-hand menu, choose *Explore items* in the *Tables* menu. Choose **serverlesspresso-config-table** in the *Tables* list.

![DynamoDB table view](../images/se-mod1-testing0.png)

3. Choose the *config* item in the *Items returned* panel. This opens the item editor. Choose **JSON** and disable *View DynamoDB JSON*.

![Config item](../images/se-mod1-testing1.png)

4. Set the store to open. Paste the following JSON, which sets `storeOpen` to `false`.

```
{
 "PK": "config",
 "storeOpen": false,
 "maxOrdersPerUser": 1,
 "maxOrdersInQueue": 10
}
```

5. Choose **Save changes** to update the table.

6. Go to the Step Functions console. From the AWS Management Console, select *Services* then select Step Functions under *Application Integration*. **Make sure your region is correct**.

7. Under *State machines*, select *OrderProcessorWorkflow*. On the page showing the workflow, choose **Start execution**.

8. In the *Start execution* pop-up, enter the following JSON payload, then choose **Start execution**:

```
{
    "detail": {
      "orderId": "1",
      "userId": "testuser"
    }
}
```

9. The *Graph inspector* shows the workflow path taken as a result of the store being closed.

![Store is closed workflow](../images/se-mod1-testing3.png)

10. The execution has ended. In the *Execution event history* panel, expand the event with the type *TaskScheduled* for the step *EventBridge PutEvents*.

![Execution history](../images/se-mod1-testing4.png)

The workflow has emitted an event indicating that the shop is unavailable. This can be consumed by other microservices in the application to take appropriate actions.

11. Set the store back to "open" in the DynamoDB table. 1. Go to the DynamoDB console. From the AWS Management Console, select *Services* then select DynamoDB under *Database*. Make sure your region is correct.

12. From the left-hand menu, choose *Explore items* in the *Tables* menu. Choose **serverlesspresso-config-table** in the *Tables* list.

13. Choose the *config* item in the *Items returned* panel. This opens the item editor.

14. Set the store back to open. Paste the following JSON, which sets `storeOpen` to `true`.

```
{
 "PK": "config",
 "storeOpen": true,
 "maxOrdersPerUser": 1,
 "maxOrdersInQueue": 10
}
```

15. Choose **Save changes** to update the table.

## 2. Testing the workflow with excess orders

While Step Functions can scale to ten of thousands of current executions, the coffee shop is configured to only handle up to 20 concurrent orders. The workflow rejects any new orders until there are less than 20 orders. In this section, you will test this by adding 21 orders.

### Step-by-step instructions ##

1. Go to the Step Functions console. From the AWS Management Console, select *Services* then select Step Functions under *Application Integration*. **Make sure your region is correct**.

2. From the left-hand menu, select *State machine* and choose **OrderProcessorWorkflow** from the list. Copy the ARN value to a scratchpad - you will need this value later. Choose **Edit**.

3. Use the [StartExecution API](https://docs.aws.amazon.com/cli/latest/reference/stepfunctions/start-execution.html) to start a new workflow. In the Cloud9 tab, in the terminal panel, enter the following command, replacing `YOUR_STATE_MACHINE_ARN` with the ARN copied in the previous step:

```
aws stepfunctions start-execution --state-machine-arn YOUR_STATE_MACHINE_ARN --input "{\"detail\":{\"orderId\":\"1\",\"userId\":\"testuser\"}}"
```

4. Run the same command 25 more times. The capacity configured for the shop is 20. After the 20th execution, the capacity check in the workflow will fail for subsequent requests.

5. In the state machine view in the console, the *Graph inspector* shows the workflow path taken as a result of capacity being unavailable:

![Store is closed workflow](../images/se-mod1-testing3.png)

## 2. Testing timed out orders

When you created the workflow, you added two transitions that wait for callbacks. These allow time for the customer to submit their order details, or the barista to make the drinks. The customer has 15 minutes to complete this step, and the barista has 15 minutes.

In this section, you will see what happens when a timeout occurs, using the executions you started in the previous step.

### Step-by-step instructions ##

After 15 minutes have elapsed since you started the execution list, the executions that were running will terminate with a *Failed* state.  

{{% notice info %}}
Complete the following steps to see this for yourself, or move ahead to the [module review section](/1b-workflow/9-review.html).
{{% /notice %}}


1. Go to the Step Functions console. From the AWS Management Console, select *Services* then select Step Functions under *Application Integration*. **Make sure your region is correct**.

2. From the left-hand menu, select *State machine* and choose **OrderProcessorWorkflow** from the list.

3. After 15 minutes have elapsed since you started the execution list. You will see that the executions that were running are now in a *Failed* state.

![Timed out executions](../images/se-mod1-testing5.png)

4. Choose the first failed execution in the list. The *Graph inspector* shows the state transition *Emit - Workflow Started TT* in orange, directing to the *Customer timeout* state. Selec the *Step output* tab to see the error and the cause.

![Execution detail](../images/se-mod1-testing6.png)

### Recap

* You tested how the workflow responds, depending on if the store is open or closed.
* You tested the store capacity feature by exceeding the allowed number of executions.
* You verified that incomplete executions timeout after 15 minutes.

Congratulations, you've now configured the workflow for the application!

### Next steps

Next, you will set up and configure events that allow other microservices to react to changes in this workflow.
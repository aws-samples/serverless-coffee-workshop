+++
title = "Order Processor workflow - testing"
weight = 3
chapter = true
pre = "<b>C. </b>"
+++


## 1. Testing the workflow with excess orders

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

![Store is closed workflow](/images/se-mod1-testing3.png)

## 2. Testing timed out orders

When you created the workflow, you added two transitions that wait for callbacks. These allow time for the customer to submit their order details, or the barista to make the drinks. The customer has 5 minutes to complete this step, and the barista has 15 minutes.

In this section, you will see what happens when a timeout occurs, using the executions you started in the previous step.

### Step-by-step instructions ##

After 5 minutes have elapsed since you started the execution list, the executions that were running will terminate with a *Failed* state.  

{{% notice info %}}
Complete the following steps to see this for yourself, or move ahead to the [module review section](/1b-workflow/9-review.html).
{{% /notice %}}


1. Go to the Step Functions console. From the AWS Management Console, select *Services* then select Step Functions under *Application Integration*. **Make sure your region is correct**.

2. From the left-hand menu, select *State machine* and choose **OrderProcessorWorkflow** from the list.

3. After 5 minutes have elapsed since you started the execution list. You will see that the executions that were running are now in a *Failed* state.

![Timed out executions](/images/se-mod1-testing5.png)

4. Choose the first failed execution in the list. The *Graph inspector* shows the state transition *Emit - Workflow Started TT* in orange, directing to the *Customer timeout* state. Selec the *Step output* tab to see the error and the cause.

![Execution detail](/images/se-mod1-testing6.png)

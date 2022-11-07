+++
title = "Handling EventBridge Events with SQS"
weight = 15
+++


## Overview
- This section demonstrates the extensibility of event driven architectures. New functional requirements come up all the time in production applications. We can address new requirements for an event driven application by creating new rules for events in the Event Bus. These rules can add new functionality to the application without having any impact to the existing application stack.   
- This section shows how to route all order completed events from the OrderManager workflow to an SQS queue. A Lambda function will process the events in batches off of the queue and insert business metrics into Cloudwatch. The new rule enables business metric collection for events in your event bus.
- Using SQS as a target for EventBridge events reduces pressure on your downstream systems from spikes in traffic in the event bus.

- ![Workflow Architecture](/images/se-mod4-OrderComplete-Cloudwatch.png)

## Track Order Metrics
- Let’s say the investors of Serverlesspresso want to understand more details about how many drinks are sold each day. While we could use the orders table to provide some metrics, it’s not so easy to write queries with the existing schema. Instead, we can create a new rule in the Event Bus and a new microservice to provide aggregate metrics for the investors.
- During the order workflow, the `WaitingCompletion` Lambda function emits an `OrderManager.WaitingCompletion` event to the Event Bus as the barista makes the order. We can use the `OrderManager.WaitingCompletion` event to update `serverlesspresso-metrics-table`.
- Serverlesspresso’s impact can be measured by collecting metrics such as orders per item type and daily order totals. With the flexibility of EventBridge rule configurations, you could even extend metrics collection to capture `OrderManager.OrderCancelled` events to track how many orders are completed or cancelled over time.
- In this module we’ll set up a new EventBridge Rule to capture all `OrderManager.WaitingCompletion` events and route them to an SQS Queue. The events are processed in batches off the queue by a Lambda function that updates metrics in Cloudwatch, where they can be viewed using a Cloudwatch Dashboard.

### 1. Launch the AWS CloudFormation template

This section has its own CloudFormation template that is separate from the core stack. You'll need to follow the steps below to deploy the resources required for this module.

{{% notice info%}}

By executing these templates, you are taking responsibility for the lifecycle and costs associated with provisioning them. Please follow the **tear-down instructions** to remove all resources from your AWS account once you have finished the workshop to avoid incurring unexpected costs.
{{% /notice %}}

We will leverage AWS CloudFormation which allows us to codify our infrastructure. Select your preferred region to which you will deploy the template. Just click the Launch link to create the stack in your account.

| Region | Launch stack |
| ------ |:------|
| **US East (N. Virginia)** us-east-1 | {{% button href="https://us-east-1.console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/quickcreate?stackName=serverless-workshop&templateURL=https://ee-assets-prod-us-east-1.s3.amazonaws.com/modules/67b03f2bcecc4fafb15053897585b61f/v1/cloudformationvLatest.yml" icon="fas fa-rocket" icon-position="right" colour="#ff0000" %}} Launch {{% /button %}} |

1. Enter a stack name (or just keep the default name)
2. **Check** the boxes in the Capabilities section
3. Click **Create stack**
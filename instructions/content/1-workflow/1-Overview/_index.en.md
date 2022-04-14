+++
title = "Overview"
weight = 11
+++

## Why do you need a workflow?

In the coffee ordering application, each customer order follows a series of steps:

* The initial QR code scan starts the ordering process.
* The application checks that the shop is open and the barista's queue is not full. In this workshop, the barista can only handle up to 20 drinks at a time. If the shop is closed or the queue is full, the order process stops.
* It waits 15 minutes for the customer to place the specifics of the drink order, such as a "Vanilla Latte with Soy Milk". If nothing happens after 15 minutes, the order times out.
* It waits 15 minutes for the barista to produce the drink. If nothing happens after 15 minutes, the order times out.
* The order is finally completed or canceled by the barista.

Each drink order will be in a separate point of this workflow. Traditionally, embedding this type of logic in code results in many nested logic branches and relying on a central database to keep track of the state. Handling timeouts also requires a separate process to take action on workflows that have exceeded their allowed time.

This type of workflow logic is an example of a state machine. This workshop uses [AWS Step Functions](https://aws.amazon.com/step-functions/) to construct a state machine that can handle all of these different steps for a given drink order. Each drink order is a separate execution of the state machine. And whether there is one drink per hour or one hundred drinks per minute, Step Functions maintains all the separate executions independently and reliably, without the need for complex custom code.

In this module, you will build the Step Functions workflow that keeps track of each individual order for the coffee shop.

## How it works

Step Functions workflows are defined using Amazon States Language (ASL). ASL is a JSON-based, structured language used to define state machines, a collection of states that do work (Task states), determine which states to transition to next (choice states), stop an execution with an error (fail states), and so on. Workflows are JSON-based documents that you can check into GitHub, and deploy with infrastructure as code tools like AWS SAM or CDK.

The AWS Management Console provides a visual builder tool called the Workflow Studio, which can help simplify building workflows. After building the tool visually, you can save it for immediate use in the AWS Cloud, or export the definition in ASL. This module uses the Workflow Studio to build the workflow.

{{% notice info %}}
Watch a 3-minute introduction to [AWS Step Functions Workflow Studio on YouTube](https://www.youtube.com/watch?v=HfTucfkIwhs).
{{% /notice %}}


*More information on this services used in this section:*
* [AWS Step Functions](https://aws.amazon.com/step-functions/)
* [AWS Step Functions Workflow Studio](https://docs.aws.amazon.com/step-functions/latest/dg/workflow-studio.html)

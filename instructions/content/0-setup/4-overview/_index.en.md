+++
title = "Overview"
weight = 14
+++

The Serverlesspresso application consists of three frontends and a backend application. The frontends are already built and deployed in an AWS-owned account. The backend is a set of serverless microservices. In this module, you will set up the environment and deploy resources needed to start building your backend.

[![See Serverlesspresso](/images/se-setup-overview4.png)](https://youtu.be/M6lPZCRCsyA)

In later sections, you will fill in the missing pieces in the diagram above:

[![See Serverlesspresso](/images/se-setup-overview5.png)](https://youtu.be/M6lPZCRCsyA)

* The *OrderProcessor* microservice - an [AWS Step Functions](https://aws.amazon.com/stepfunctions) Workflow, that orchestrates each customer order from start to completion
* The event routing logic routes events to the correct downstream service (consumer).

Once you have built the back-end resources needed, you will update the front-end application configuration to query the API Gateway endpoint and display the information about all the current menu and order status.

Each of the following sections provides an implementation overview and detailed, step-by-step instructions.

{{% notice note %}}
Please ensure that you follow the instructions in the order listed.
{{% /notice %}}

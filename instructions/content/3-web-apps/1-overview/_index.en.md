+++
title = "Overview"
weight = 11
+++

The frontends enable customers and baristas to interact with the backend application. There are 3 frontend applications:

* **Display App**: displays the QR code and upcoming/completed drinks orders.
* **Barista App**: allows the barista to complete and cancel orders as they arrive.
* **Customer App**: enables customers to place and cancel drinks orders.

In this module, you will set up each of these frontends, so you can perform an end-to-end test of your backend application.

## How it works

* The frontends are Vue.js applications that have been deployed with [AWS Amplify](https://aws.amazon.com/amplify/). For simplicity, these have been deployed for you already.
* The frontend applications use Amazon Cognito to allow customers to register and sign-in to their accounts. The backend uses the same Cognito configuration to identify users.
* The frontends use [Amazon API Gateway](https://aws.amazon.com/api-gateway/) endpoints to communicate with key services.
* They also use a WebSocket connection to [AWS IoT Core](https://aws.amazon.com/iot-core/) to receive real-time messages. You will set this up in the next module.

## Pushing messages back to the frontends with WebSockets

Modern web applications commonly use the publish-subscribe pattern to receive notifications as data changes. From receiving alerts when new email arrives to providing dashboard analytics, this method allows for much richer streams of events from backend systems.

The Serverlesspresso frontends use this pattern when listening for changes in order status. The frontends subscribe via the AWS SDK and then wait for messages published by the backend. The SDK automatically manages the WebSocket connection and also handles many common connectivity issues in web apps. The messages are categorized using topics, which are strings defining channels of messages.

The AWS IoT Core service manages broadcasts between backend publishers and frontend subscribers. This enables fan-out functionality, which occurs when multiple subscribers are listening to the same topic. You can broadcast messages to thousands of frontend devices using this mechanism. For web application integration, this is the preferable way to implement publish-subscribe than using Amazon SNS.

*To learn more about different ways to communicate between frontends and backends, read [Managing backend requests and frontend notifications in serverless web apps](https://aws.amazon.com/blogs/compute/managing-backend-requests-and-frontend-notifications-in-serverless-web-apps/).*

## Finding the settings

The frontends are hosted for you and require configuration to connect to the backend you have deployed in this workshop. The settings for all three applications are the same but you must configure each individually.

1. In the AWS Cloud9 terminal, run this command to retrieve the `poolId` value:

```
aws cognito-identity list-identity-pools --max-results 10
```

![Terminal output](/images/se-mod3-frontends-setup1.png)

2. Run this command to retrieve the `host` value:

```
aws iot describe-endpoint --endpoint-type iot:Data-ATS
```

![Terminal output](/images/se-mod3-frontends-setup2.png)

3. You will need the outputs that you saved from the core deployment in the *Setup* module. If you have these, skip ahead to the next section, otherwise continue.

4. You can fetch the outputs from the CloudFormation stack deployed by AWS SAM. Navigate to the [AWS CloudFormation console](https://console.aws.amazon.com/cloudformation/home). Make sure that the Region is the same.

5. Select the *Stacks* menu on the left, then choose the *Stack name* *serverlesspresso-backend*.

![CloudFormation stacks](/images/se-mod3-backend-display2.png)

6. Select the *Outputs* tab. This displays the resource names and values needed for the front-end configuration settings.

![CloudFormation stack outputs](/images/se-mod3-backend-display3.png)

Wherever the instructions reference the "Key" names, enter the corresponding "Value". The values uniquely identify resources in your backend stack.

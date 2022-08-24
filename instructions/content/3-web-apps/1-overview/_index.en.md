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

You will run some AWS CLI commands using [AWS CloudShell](https://aws.amazon.com/cloudshell/), a browser-based shell terminal that makes it easy to securely manage, explore, and interact with your AWS resources. 

### To start AWS CloudShell: ###

1. In the Search Bar of the AWS Management Console type *CloudShell*, and chose CloudShell from the search options:

![CloudShell output](/images/se-mod3-cloudshell-1.png)

2. Choose *Close*, to progress past the welcome alert:

![CloudShell output](/images/se-mod3-cloudshell-2.png)

3. In the CloudShell terminal, enter the following command to retrieve the `poolId` value:

```
aws cognito-identity list-identity-pools --max-results 10
```
![Terminal output](/images/se-mod3-frontends-setup1.png)

4. Run this command to retrieve the `host` value:

```
aws iot describe-endpoint --endpoint-type iot:Data-ATS
```

![Terminal output](/images/se-mod3-frontends-setup2.png)

Copy these two values to a scratch pad, you will need them in "The Display App" section.

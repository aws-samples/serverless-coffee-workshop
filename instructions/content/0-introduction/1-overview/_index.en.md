+++
title = "Overview"
weight = 11
+++
[![See Serverlesspresso](/images/play.png)](https://youtu.be/M6lPZCRCsyA)

## Let's get caffeinated!

Serverlesspresso is a pop-up coffee shop that provides premium espresso drinks at conferences and events. The organizers have brought an elite team of the world's best baristas to brew 1,000 drinks a day for customers.

Our job today is to help build a serverless application to help them accept orders and notify customers when their drinks are ready. We have to build a robust solution that scales to meet demand, handles the workflow of individual drinks, and authenticates our coffee drinkers.

The coffee bar opens in 2 hours! Good luck!

## How does the coffee bar work?

The coffee bar ordering process is as follows:
1. The overhead monitors display a QR code that changes every 5 minutes. Customers scan this QR code to place an order using their mobile device. The QR code is good for 10 drinks in the 5-minute period, and disappears off the screen once there are no more drinks available. This helps prevent the baristas from getting swamped with orders!
2. The customer places the order on the web app loaded by the QR code. The backend validates the order, creates an order number, and makes it available to the baristas.
3. The baristas see the order appear on their own app. They can change the status of the order to indicate when it is being made, when it's completed, or if they need to cancel the order.
4. The customer sees all the barista updates on their mobile device. The overhead monitors also show the status of upcoming and completed drinks.

## Application structure

You will be creating various microservices that integrate existing frontends with your backend serverless application. You will be using AWS Step Functions to handle orchestration and Amazon EventBridge to handle choreography.

### Frontends

The frontends are already deployed. Once you have built the backend, you will provide environment variables to the frontends to enable them to connect. The three frontends are:

* **Display app**: This is displayed on overhead monitors. It provides a barcode for customers to scan to place an order, and shows a realtime queue of upcoming and completed drink orders.
* **Barista app**: This runs on tablets used by the baristas. The app allows baristas to change the status of a drink order, or cancel the order if needed. Updates from this application are propagated to the other apps.
* **Ordering app**: This is used by customers to place an order. It is designed to run on mobile devices. When you are testing today, you'll use your mobile device with this app to place orders.

### Backend
The backend application architecture uses [AWS Step Functions](https://aws.amazon.com/step-functions/), [Amazon EventBridge](https://aws.amazon.com/eventbridge/), [AWS Lambda][lambda], [Amazon API Gateway][api-gw], [Amazon S3][s3], [Amazon DynamoDB][dynamodb], and [Amazon Cognito][cognito].

JavaScript executed in the frontend browser application sends and receives data from a backend API built using API Gateway and Lambda. DynamoDB provides a persistence data storage layer which is used by the API's Lambda functions. Events are routed back to the frontend applications using AWS IoT Core and Lambda.

See the diagram below for the complete architecture.

![Overall architecture](/images/se-0-architecture.png)

[amplify-console]: https://aws.amazon.com/amplify/console/
[cognito]: https://aws.amazon.com/cognito/
[lambda]: https://aws.amazon.com/lambda/
[api-gw]: https://aws.amazon.com/api-gateway/
[s3]: https://aws.amazon.com/s3/
[dynamodb]: https://aws.amazon.com/dynamodb/
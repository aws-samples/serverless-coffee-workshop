+++
title = "Instructions"
weight = 11
+++

This page provides instructions for cleaning up the resources created during the preceding modules. Many resources would cost you nothing under the free tier, but removing them is recommended.

## Cleaning up resources

To remove and delete resources used by this workshop:

### 1. S3 Buckets
1. From Cloud9, to get a list of buckets used for this workshop, enter:
```
aws s3 ls | grep serverlesspresso
```
2. Delete each bucket and its content, replacing `your-bucket-name` with each bucket name:
```
aws s3 rb --force s3://your-bucket-name
```

### 2. Resources in CloudFormation
1. From Cloud9, get a list of stacks used in this workshop:
```
aws cloudformation list-stacks | grep serverlesspresso
```
2. Delete each stack beginning with `serverlesspresso`, replacing `your-stack-name` with each stack name:
```
aws cloudformation delete-stack --stack-name your-stack-name
```

### 3. EventBridge Rules
1. From Cloud9, get a list of EventBridge rules used in this workshop:
```
aws events list-rules --event-bus-name Serverlesspresso
```
2. Delete each rule, replacing `your-rule-name` with the rule name:
```
aws events delete-rule --name 'your-rule-name'
```

### 4. AWS Cloud9
1.  From the [Cloud 9 console][cloud9-console], select your instance and choose **Delete**.
1.  This deletes all workshop data from the instance and stops billing.


[amplify-console-console]: https://console.aws.amazon.com/amplify/home
[api-gw-console]: https://console.aws.amazon.com/apigateway/home
[cloud9-console]: https://console.aws.amazon.com/cloud9/home
[codecommit-console]: https://console.aws.amazon.com/codesuite/codecommit/repositories
[cognito-console]: https://console.aws.amazon.com/cognito/home
[dynamodb-console]: https://console.aws.amazon.com/dynamodb/home
[iam-console]: https://console.aws.amazon.com/iam/home
[lambda-console]: https://console.aws.amazon.com/lambda/home
[cloudformation-console]: https://console.aws.amazon.com/cloudformation/home
[quicksight-console]: https://quicksight.aws.amazon.com/
[kinesis-console]: https://console.aws.amazon.com/kinesis/home
[firehose-console]: https://console.aws.amazon.com/firehose/home
[sns-console]: https://console.aws.amazon.com/sns/home
[s3-console]: https://console.aws.amazon.com/s3/home
[iam-console]:https://console.aws.amazon.com/iam/home
[eventbridge-console]:https://console.aws.amazon.com/events/home
[cloudwatch-console]:https://console.aws.amazon.com/cloudwatch/home

+++
title = "Self hosted"
weight = 3
+++

### 1. Launch the AWS CloudFormation template

This workshop can be run inside your own AWS accounts. To enable you to follow the workshop, we need to set up and configure a number of AWS services. We have made provisioning these services as simple as possible.

{{% notice info%}}

By executing these templates, you are taking responsibility for the lifecycle and costs associated with provisioning them. Please follow the **tear-down instructions** to remove all resources from your AWS account once you have finished the workshop to avoid incurring unexpected costs.
{{% /notice %}}

We will leverage AWS CloudFormation which allows us to codify our infrastructure. Select your preferred region to which you will deploy the template. Just click the Launch link to create the stack in your account.

| Region | Launch stack |
| ------ |:------|
| **US East (N. Virginia)** us-east-1 | {{% button href="https://us-east-1.console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/quickcreate?stackName=serverless-workshop&templateURL=https://ws-assets-prod-iad-r-iad-ed304a55c2ca1aee.s3.us-east-1.amazonaws.com/28e7066a-b0bb-42ad-a0e9-8e8eeeb51133/workshop-self-service.yaml" icon="fas fa-rocket" icon-position="right" colour="#ff0000" %}} Launch {{% /button %}} |





1. Enter a stack name (or just keep the default name)
2. **Check** the boxes in the Capabilities section
3. Click **Create stack**

![Quick create stack](../images/se-mod0-c9stackLaunch.png)

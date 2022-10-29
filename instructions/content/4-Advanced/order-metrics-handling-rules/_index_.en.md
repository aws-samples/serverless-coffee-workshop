+++
title = "Handling EventBridge Events with SQS"
weight = 13
+++

## Creating the "WaitingCompletion" rule

### Step by Step Instructions
1. Go to the EventBridge console. From the AWS Management Console, select *Services* then select EventBridge *Application Integration*. **Make sure your region is correct**.

2. Choose **Rules**. Choose **Create rule**.
3. In Step 1 of the wizard:
- For the Name, enter *OrderManagerWaitingCompletion*.
- For *Event bus*, enter `Serverlesspresso`.
- Choose **Next**.
![Rule Configuration](/images/se-mod4-rule.png)
1. In Step 2 of the wizard:
-  For Event source, select Other.
-  Ignore the Sample event panel.
-  In the Event pattern panel, paste the following:
```
{
    "source": ["awsserverlessda.serverlesspresso"],
    "detail-type": ["OrderManager.WaitingCompletion"]
}
```
-  Choose **Next**
5. In Step 3 of the wizard:
  - In the Target 1 panel, choose AWS service.
  - In the Select a target dropdown, choose SQS queue
  - In the Queue dropdown, choose the SQS Queue `MetricsQueue`.
  - This was deployed by the core stack in the setup module. Tip: you can start typing “MetricsQueue” into the field to find the queue.
  - Choose Next.
![Target Configuration](/images/se-mod4-target.png)

6. In Step 4 of the wizard, choose **Next**.

7. In Step 5 of the wizard, check that the *Define rule detail* panel that the *Event bus* is `Serverlesspresso`. Choose **Create rule**.

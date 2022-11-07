+++
title = "Handling EventBridge Events with SQS"
weight = 17
+++

## Testing the "OrderManager.WaitingCompletion" Rule

### Step-by-step instructions
8. Single Order Test
   - Create a new order. 
   - Check the `Serverlesspresso_Metrics` CloudWatch Dashboard
     - Navigate to CloudWatch in the AWS Console, then select `Dashboards`
   - You’ll see 2 metrics in the Dashboard with populated values: (Similar to screenshot above)
       - Total Orders: 1
       - *Drink* Sold: 1
   - These values are incremented each time there’s an `OrderManager.WaitingCompletion` event in the Event Bus.
9. Load Testing
  - We’ll now use a Lambda function to simulate a large number of orders and see how SQS can act as a buffer for event processing during traffic spikes.
  - These events will be matched with the WaitingCompletion rule and sent to MetricsQueue-Cloudwatch.
  - Before you run the load test, let's look at how Lambda will process messages off the queue.
  - Each invocation of the Lambda function will process the events in batches of up to 10 records or windows of 30 seconds. Reserved Concurrency defines how many concurrent Lambda executions would read messages off the queue, the default is up to 1000 concurrent executions at any given time. By using Reserved Concurrency, we’re saying there should only be 1 concurrent execution of this specific Lambda function. 
  - You can customize the ReservedConcurrentExecutions, BatchSize, and MaximumBatchingWindowInSeconds values to adjust how many records are processed at any given time, our current configuration means we'll process up to 10 records per Lambda execution.
  - You can check the CloudWatch dashboard `Serverlesspresso_Metrics` to see the metrics as they’re updated during the load test. You'll see four metrics; counts for each item type and a total order count.
  - ![Dashboard](/images/se-mod4-CWDashboard.png)
  - Navigate to the Lambda console and search for the `EventsLoadTest` Lambda function
  - ![Lambda Console Search](/images/se-mod4-LambdaSearch.png)
  - Invoke the `EventsLoadTest` Lambda function to simulate `OrderManager.WaitingCompletion` events in the Event Bus by clicking on the orange Test button.
  - ![Invoke Lambda Function](/images/se-mod4-invokeLoadTest.png)
  - You will be prompted to create a test event.
  - For the Event Name, enter *Test*
  - For the Event JSON, you can use the default value.
  - ![Lambda Test Event](/images/se-mod4-LambdaTestEvent.png)
  - Click Save, then click on the orange Test button again to execute the load test.
10. Viewing Load Test Results:
- Open up the `PublishMetrics` Lambda function and navigate to the `Monitoring` tab. Expand the `PublishMetrics` function Invocations graph and select "Maximum" instead of "Sum". You'll see only 1 concurrent execution during the load test. Instead of scaling to process all the messages in the SQS Queue, Reserved Concurrency limited the function to only 1 concurrent execution.
- Check the `Serverlesspresso_Metrics` dashboard.
   - You’ll see around around 500 total orders were simulated during the load test.
## Takeaways
- We were able to provide business metrics for the investors by setting up a new rule and microservice without needing to modify the existing application stack. 
- Use Cloudwatch metrics for custom business metrics and enabling observability into the performance of your event driven application.
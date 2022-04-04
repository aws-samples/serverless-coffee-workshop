+++
title = "Overview"
weight = 11
+++

## What are events?

In the simplest terms, an event is a signal that a system's state has changed. In AWS, it's represented as a JSON message, containing some set of facts about what changed and potentially what the current state of the system is.

Events are:
* Facts: they are based on something that happened.
* Immutable: they cannot be undone. For example, an event could be a new coffee order. If you cancel the order, that is a separate cancellation event, and does not change the contents of the original event.
* Observable: microservices can subscribe to events they care about.
* Temporal: the time of an event matters.

## What does an event look like?

Events are JSON messages containing a message wrapped in an envelope:

![Example event](../images/se-mod3-events-overview1.png)

- The envelope, shown in the red box above, contains attributes provided by EventBridge. These identify the source AWS account, timestamp, source Region, and AWS resources.
- The `source` attribute is provided by the application creating the event. This workshop uses the source `awsserverlessda.serverlesspresso` to uniquely identify all events related to this workload. To can set this to almost any value (AWS events use a prefix of "AWS", which is reserved).
- The `detail-type` attribute is also set by the application creating the event. This provides information about the type of event. In this example, `OrderProcessor.WorkflowStarted` indicates the source of *OrderProcessor* and an action of *WorkflowStarted*.
- The `detail` attribute is a JSON payload containing custom event information. For custom events you create, this can be any arbitrary JSON.

The maximum message size is 256 KB. To learn more, read about [EventBridge quotas](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-quota.html).

## How do you route events between systems and microservices?

The workflow created in module 1 orchestrates individual orders from start to finish. Some of the workflow steps require human interaction (such as a customer submitting their drink order, or the barista accepting and completing the order).

The workflow emits an event at these steps and then waits for a response before continuing. The event is emitted to a serverless event bus where it is routed to the relevant service(s).

The routing is performed by [Amazon EventBridge](https://aws.amazon.com/eventbridge/). You publish events to buses, and subscribers use rules to filter for events they care about. In this module, you'll create *rules* in EventBridge to capture and route these events to the relevant service.

## How it works

EventBridge lets you route events from AWS services, custom applications, software as a service application and microservices. The events are sent to buses, including custom buses you can set up specifically for your workload. Consumers such as AWS services or microservices then use rules to filter for the messages they want to receive.

![Drag Pass state to designer](../images/se-mod1-routing1.png)

This is the messaging behind event driven architecture. It allows you to decouple the producers and consumers of events - the producers do not know who, if anyone, is listening to the events they publish. Similarly, subscribers do not know if anyone else is listening and they may not know the publisher of the event.

This can make it faster to develop new features in software, increase extensibility, and reduce friction between development teams.

{{% notice info %}}
Watch this [introduction to EventBridge video on YouTube](https://www.youtube.com/watch?v=TXh5oU_yo9M).
{{% /notice %}}

*More information on this services used in this section:*
* [Amazon EventBridge](https://aws.amazon.com/eventbridge/)
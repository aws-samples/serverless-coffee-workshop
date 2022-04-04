+++
title = "Publishing events to the frontends"
weight = 12
+++

## How it works

The Publisher microservice receives events through EventBridge rules and forwards these to topics in AWS IoT Core. The frontends are configured to listen to the appropriate topics.

![Architecture](../images/se-mod3-publisher2.png)

There are three topics:
1. Admin: this is reserved for events related to admin apps (the Barista and Display app).
2. User: the Customer App subscribes to this topic to get information related to the currently logged in user.
3. Config: all apps subscribe to this topic for changes in the system configuration, such as when the menu or store state changes.

There are three Lambda functions and three EventBridge rules, each publishing to a separate topic, and these have been deployed during the setup.

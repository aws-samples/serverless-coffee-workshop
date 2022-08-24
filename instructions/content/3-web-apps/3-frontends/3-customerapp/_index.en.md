+++
title = "The Customer App"
weight = 13
+++

The Customer App runs on customers' smartphones. When they first scan the QR code using a smartphone, the URL redirects the browser to this web app.

## Inside this section

This frontend has already been deployed and is presented as a hosted UI at https://workshop-order.serverlesscoffee.com/.

- The hosted UI presents a configuration page when you first visit this URL.
- After entering the configuration settings, it stores these in the browser's local cache.
- The settings you use are not visible to anyone else visiting the same URL.

*Source code for this application:*
* [The Customer App ](#)

## Setting up the Customer App

### Step-by-step instructions ###

1. You can transfer the configuration from the Display App to avoid typing the settings manually on your smartphone. If you have configured the Display App, switch to that tab in your browser, or navigate to https://workshop-display.serverlesscoffee.com/. Choose the **Configure order app** button in the toolbar.

![Settings page](/images/se-mod3-backend-OrderNew1.png)

2. This opens a popup containing a QR code, which embeds the backend settings into a query string.

![Configuration settings](/images/se-mod3-frontends-customer2.png)

3. On your smartphone, use the barcode scanner app to scan this QR code. This opens the configuration settings page and populates the fields with the backend settings.

![Configuration settings](/images/se-mod3-frontends-customer3.png)

4. Choose **Save and reload**. Close this tab for now.

## Next steps

You have now configured all three of the web apps and can test your workload from end-to-end.
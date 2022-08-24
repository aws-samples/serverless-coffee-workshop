+++
title = "The Barista App"
weight = 12
+++

The Barista App runs on a tablet next to the coffee bar and it's operated by the barista. It provides a list of upcoming orders and enables the barista to mark incoming orders as completed or canceled.

## Inside this section

This frontend has already been deployed and is presented as a hosted UI at https://workshop-barista.serverlesscoffee.com/.

- The hosted UI presents a configuration page when you first visit this URL.
- After entering the configuration settings, it stores these in the browser's local cache.
- The settings you use are not visible to anyone else visiting the same URL.

*Source code for this application:*
* [The Barista App](#)

## Setting up the Barista App

### Step-by-step instructions ###

1. You can transfer the configuration from the Display App to avoid typing the settings manually. If you have configured the Display App, switch to that tab in your browser, or navigate to https://workshop-display.serverlesscoffee.com/. Choose the **Configure Barista app** button in the toolbar.


![Settings page](/images/se-mod3-backend-baristaNew1.png)

2. This opens the Barista App configuration page in a new window with the backend settings embedded into the URL query string.

![Settings page](/images/se-mod3-backend-baristaNew2.png)

6. Choose **Save and reload**.

7. Select the *Sign In* tab. Enter the email and password for the account you configured in the previous section. Choose **Sign In**

![Signin screen](/images/se-mod3-frontends-setup3.png)

6. The Barista App is shown.

![Barista App](/images/se-mod3-frontends-barista4.png)

Note the three admin buttons provided on the toolbar:

* **Open store**: This toggles the store open state between *Open* and *Closed*. When the store is closed, the Order App cannot place any new orders.
* **Clear settings**: Empties the local settings cache and clears the backend settings. This causes the *Settings* page to be displayed the next time the page reloads. Use this if you want to change your backend settings.
* **Sign out**: Signs out the Cognito user from the frontend and returns you to the sign-in page.

Keep the Barista App open in a browser tab.

## Next steps

Next, you will set up the Order App.
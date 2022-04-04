+++
title = "The Display App"
weight = 11
+++

The Display App runs on a monitor above the coffee bar. It provides a list of upcoming and completed drinks. It also shows the QR code that customers scan to start their orders. This is the first of three frontends you will set up.

## Inside this section

This frontend has already been deployed and is presented as a hosted UI at https://workshop-display.serverlesscoffee.com/.

- The hosted UI presents a configuration page when you first visit this URL.
- After entering the configuration settings, it stores these in the browser's local cache.
- The settings you use are not visible to anyone else visiting the same URL.

*Source code for this application:*
* [The Display App ](#)

## Setting up the Display App

### Step-by-step instructions ###

1. Open a new tab in your browser. We recommend using Chrome or Firefox throughout the workshop.

![Settings page](/images/se-mod3-backend-display1.png)

2. Going down the list of settings in the frontend settings page:
- **Region**: enter the Region code you have been using during the workshop (e.g. `us-east-`).
- **UserPoolID**: enter the value from the key `UserPoolID` from the CloudFormation stack.
- **UserPoolWebClientID**: enter the value from the key `UserPoolWebClientID` from the CloudFormation stack.
- **PoolId**: enter the `poolId` value from *Finding the Settings* earlier..
- **Host**: enter the `host` value from *Finding the Settings* earlier.
- **OrderManagerEndpoint**: enter the value from the key `OrderManagerEndpoint` from the CloudFormation stack.
- **APIGWEndpointValidatorService**: enter the value from the key `APIGWEndpointValidatorService` from the CloudFormation stack.
- **APIGWEndpointConfigService**: enter the value from the key `APIGWEndpointConfigService` from the CloudFormation stack.

![Settings page](/images/se-mod3-backend-display4.png)

3. Choose **Save and reload**.

![Cognito signin](/images/se-mod3-backend-display5.png)

## Setting up a user account

The Serverlesspresso application supports bother user and admin accounts. The admin account can log into the Display and Barista apps, whereas users can only log into the Customer app. In this section, you will create an admin user to log into all apps.

### Step-by-step instructions ###

1. Select the *Create Account* tab. Enter a valid email you have access to during the workshop, together with a password. Choose **Create Account**

![Cognito signin completed](/images/se-mod3-backend-display6.png)

2. Enter the verification code from the email and choose **Confirm**.

![Verification code](/images/se-mod3-backend-display7.png)

3. In a separate browser tab, navigate to the [Cognito console](https://us-east-2.console.aws.amazon.com/cognito/). Choose *ServerlesspressoUserPool*.

![Cognito console](/images/s3-mod3-cognito1.png)

4. Select the *Groups* tab, then choose **Create group**.

![Cognito console](/images/s3-mod3-cognito2.png)

5. In the *Create group* page, enter `admin` for the *Group name* and choose **Create group**.

![Cognito console](/images/s3-mod3-cognito3.png)

6. Selec then *Users* tab, then choose the user you created.

![Cognito console](/images/s3-mod3-cognito4.png)

7. In *Group memberships*, choose **Add user to group**. Select *admin* and choose **Add**.

![Cognito console](/images/s3-mod3-cognito5.png)

8. Go back to the browser tab showing the Display App. Log in with the user you created and the the Display App is now shown.

![Display app](/images/se-mod3-backend-display8.png)

Note the three admin buttons provided in the top right-hand corner:

* **Configure order app**: Use this for transferring settings to the Order App later in this section.
* **Clear settings**: Empties the local settings cache and clears the backend settings. This causes the *Settings* page to be displayed the next time the page reloads. Use this if you want to change your backend settings.
* **Sign out**: Signs out the Cognito user from the frontend and returns you to the sign-in page.

The QR code shown will change every five minutes and limit the total number of orders to the value shown on the screen (10 by default). Later, in the end-to-end test, you will scan this QR code to start the ordering process.

Keep the Display App open in a browser tab.

## Next steps

Next, you will set up the Barista App.
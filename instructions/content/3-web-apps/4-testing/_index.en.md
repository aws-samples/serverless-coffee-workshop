+++
title = "End-to-end test"
weight = 14
+++

It's time to complete a full end-to-end test with the front-end application using your smartphone - this step requires the use of an iPhone or Android device.

## Ordering a drink with the customer app

### Step-by-step instructions ###

1. Ensure that the [Display App](https://workshop-display.serverlesscoffee.com/) and [Barista App](https://workshop-barista.serverlesscoffee.com/) are open in two separate browser tabs.

- The Display App powers a display above the coffee bar.
- The Barista App powers a tablet used by the barista.

![Two web apps side-by-side](/images/se-mod3-testing1.png)

2. Open the barcode scanner on your smartphone. Some phone models may require the use of a free QR scanner app instead of the default barcode scanner. Scan the QR code on the Display App. If a barcode isn't currently shown because the screen is in a timeout period, wait until the timer counter ends and the barcode reappears.

3. Sign into the app using the account you created in a previous section.

![Two web apps side-by-side](/images/se-mod3-frontends-customer4.png)

4. After the token validates, select a drink to order and choose **Order Now**. If your app keeps running the configuration every time you scan the QR code, make sure you are not using the "private browsing" configuration for Safari or "incognito" for Chrome on your smartphone.

![Ordering app menu](/images/se-mod3-testing2.png)

5. Verify the Display and Barista apps to see the new order arrive.

![Ordering app menu](/images/se-mod3-testing3.png)

6. Interact with the Barista app to *Make* or *Cancel* the drink and note how the Display and Customers apps are updated.

7. Repeat steps 2-6 to place additional orders and experiment with the application's functionality. You can also navigate to the Step Functions console to see the workflows for each coffee drink.

### Next steps

**Congratulations!** You have completed an end-to-end backend test for the Serverlesspresso application. If you have time remaining in the workshop, complete the optional module to add a new microservice to the app that creates a Coffee Journey report for each customer.
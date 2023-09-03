/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

'use strict'

import { createApp } from 'vue'
import App from './App.vue'

// Theming framework
import { VuesticPlugin } from 'vuestic-ui'
import 'vuestic-ui/dist/vuestic-ui.css'

// Global event bus
import mitt from 'mitt'
const emitter = mitt()

// Amplify imports
import Amplify from 'aws-amplify'

// Phone number handling
import VueTelInput from 'vue3-tel-input'
import 'vue3-tel-input/dist/vue3-tel-input.css'

const app = createApp(App).use(  VuesticPlugin,{
  components: {
    VaChip: {
      outline: true,
      rounded: false,
      size: 'large',
      color: '#000'
    },
    VaCard:{
      stripe: false,
      stripeColor:"black",
      square: false
    },
    VaButton:{
      color:"#08c18a"
    },

    VaButtoGroup:{
      color:"#08c18a"
    }
  },
}).use(VueTelInput)
app.config.globalProperties.emitter = emitter

/* ===================================================
                      CONFIGURATION
    You must add your own values here! See the tutorial
    in the GitHub repo for more information. @jbesw
   =================================================== */

app.config.globalProperties.$appLogo = 'https://assets.serverlesscoffee.com/images/serverlesspresso-large.png'

// ** Backend config **
app.config.globalProperties.$appName = 'Validator'
app.config.globalProperties.$adminApp = true

// Get global vars from local cache
if (localStorage.UIstate) {
  const UIstate = JSON.parse(localStorage.UIstate)
  console.log('Mounted - Local storage: ', UIstate)

  // Hydrating state from local cache
  app.config.globalProperties.$APIurl = 'https://en0zvine6g.execute-api.ap-southeast-1.amazonaws.com/Prod'
  app.config.globalProperties.$region = 'ap-southeast-1'

  app.config.globalProperties.$ordersAPIurl = 'https://en0zvine6g.execute-api.ap-southeast-1.amazonaws.com/Prod/'
  app.config.globalProperties.$APIconfigURL = 'https://4rkb07gzf1.execute-api.ap-southeast-1.amazonaws.com/Prod/'
  app.config.globalProperties.$poolId = 'ap-southeast-1_WpLE8AlIr'
  app.config.globalProperties.$ConfigEndpoint = 'https://4rkb07gzf1.execute-api.ap-southeast-1.amazonaws.com/Prod/config',
  app.config.globalProperties.$host = '446dboc3mqtkarht692s56e3oi'
}

// // Are global vars initialized?
// app.config.globalProperties.$init = false

// // Only init if settings are provided
// if (app.config.globalProperties.$APIurl === '' ||
//     app.config.globalProperties.$region === '' ||
//     app.config.globalProperties.$ordersAPIurl === '' ||
//     app.config.globalProperties.$APIconfigURL === '' ||
//     app.config.globalProperties.$poolId === '' ||
//     app.config.globalProperties.$ConfigEndpoint === '' ||
//     app.config.globalProperties.$host === '') {

//     try {
//       Amplify.configure({
//         Auth: {
//           region: this.$region,
//           identityPoolRegion: this.$region,
//           userPoolId: this.$poolId,
//           userPoolWebClientId: this.$host,
//           mandatorySignIn: false,
//           authenticationFlowType: 'CUSTOM_AUTH',
//         }
//       })
//     } catch (err) {
//       console.error('Error: ', err)
//     }
//     app.config.globalProperties.$init = true
//  }

 Amplify.configure({
  Auth: {
    // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
    // identityPoolId: 'XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab',
    // identityPoolId: 'us-west-2:5b74593f-3626-47aa-a04e-6761adb4c772',
    region: 'ap-southeast-1',
    identityPoolRegion: 'ap-southeast-1',
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'ap-southeast-1_WpLE8AlIr',
    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '446dboc3mqtkarht692s56e3oi',
    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    mandatorySignIn: false,
    // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
    authenticationFlowType: 'CUSTOM_AUTH',
  }
})

app.config.globalProperties.$init = true

app.mount('#app')
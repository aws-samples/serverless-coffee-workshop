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
  app.config.globalProperties.$APIurl = UIstate.APIurl || 'https://en0zvine6g.execute-api.ap-southeast-1.amazonaws.com/Prod'
  app.config.globalProperties.$region = UIstate.region || 'ap-southeast-1'

  app.config.globalProperties.$ordersAPIurl = UIstate.ordersAPIurl || 'https://en0zvine6g.execute-api.ap-southeast-1.amazonaws.com/Prod'
  app.config.globalProperties.$APIconfigURL = UIstate.APIconfigURL || 'https://4rkb07gzf1.execute-api.ap-southeast-1.amazonaws.com/Prod/config'
  app.config.globalProperties.$poolId = UIstate.$poolId || 'ap-southeast-1:01c4c338-5d62-4be8-9a6c-7e750390ff97'
  app.config.globalProperties.$ConfigEndpoint = UIstate.ConfigEndpoint || 'https://4rkb07gzf1.execute-api.ap-southeast-1.amazonaws.com/Prod/config',
  app.config.globalProperties.$host = UIstate.host || 'a3tw82l7ucghei-ats.iot.ap-southeast-1.amazonaws.com'
}

// Are global vars initialized?
app.config.globalProperties.$init = false

// Only init if settings are provided
if (app.config.globalProperties.$APIurl === '' ||
    app.config.globalProperties.$region === '' ||
    app.config.globalProperties.$ordersAPIurl === '' ||
    app.config.globalProperties.$c === '' ||
    app.config.globalProperties.$poolId === '' ||
    app.config.globalProperties.$ConfigEndpoint === '' ||
    app.config.globalProperties.$host === '') {

    try {
      Amplify.configure({
        Auth: {
          region: this.$region,
          identityPoolRegion: this.$region,
          userPoolId: this.$poolId,
          userPoolWebClientId: this.$host,
          mandatorySignIn: false,
          authenticationFlowType: 'CUSTOM_AUTH',
        }
      })
    } catch (err) {
      console.error('Error: ', err)
    }
    app.config.globalProperties.$init = true
 }

app.mount('#app')
/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

'use strict'

import { createApp } from 'vue'
import App from './App.vue'

// Vuestic theming
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

/* ===================================================
                      CONFIGURATION
    You must add your own values here! See the GitHub
    repo for more information. @jbesw
   =================================================== */

Amplify.configure({
  Auth: {
    region: 'ap-southeast-1',
    identityPoolRegion: 'ap-southeast-1',
    userPoolId: 'ap-southeast-1_WpLE8AlIr',
    userPoolWebClientId: '446dboc3mqtkarht692s56e3oi',
    mandatorySignIn: false,
    authenticationFlowType: 'CUSTOM_AUTH',
  }
})

const app = createApp(App).use(VuesticPlugin)
app.config.globalProperties.emitter = emitter
app.use(VueTelInput)

app.config.globalProperties.$appName = 'Barista'
app.config.globalProperties.$adminApp = true

// ** Backend config **
app.config.globalProperties.$region = 'ap-southeast-1'
app.config.globalProperties.$APIurl = 'https://en0zvine6g.execute-api.ap-southeast-1.amazonaws.com/Prod'
app.config.globalProperties.$APIconfigURL = 'https://4rkb07gzf1.execute-api.ap-southeast-1.amazonaws.com/Prod/'
app.config.globalProperties.$ConfigEndpoint = 'https://4rkb07gzf1.execute-api.ap-southeast-1.amazonaws.com/Prod/config'

// ** Websocket connection **
//  PoolId: Retrieve this with the CLI command: aws cognito-identity list-identity-pools --max-results 10 --region <<REGION>>
app.config.globalProperties.$poolId = 'ap-southeast-1:01c4c338-5d62-4be8-9a6c-7e750390ff97' // 'YourCognitoIdentityPoolId'
//  IoTendpoint: Retrieve this with the CLI command: aws iot describe-endpoint --endpoint-type iot:Data-ATS --region us-west-2
app.config.globalProperties.$host = 'a3tw82l7ucghei-ats.iot.ap-southeast-1.amazonaws.com' // 'YourAwsIoTEndpoint', e.g. 'prefix.iot.us-east-1.amazonaws.com'

app.mount('#app')
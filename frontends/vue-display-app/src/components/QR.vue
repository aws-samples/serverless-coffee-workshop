<template>
  <!-- Store open -->
  <div class="div tokenContainer" style="">
    <!-- Tokens available -->
    <div v-show="isRefreshing && availableTokens > 0">
      <div class="mb-2" @click="toggleDebuggingInfo">
        <transition name="fade" class="pl-2 mr-2">
          <qrcode-vue :size="getQRwidth()" :value="getQRURL()" />
          <!-- <p>last_code</p> -->
        </transition>
        <!-- <p v-show="availableTokens>0">Code is <code>{{ last_code }}</code> - expires in {{ getSeconds() }} seconds.</p> -->
        <va-progress-bar color="#08c18a" :model-value="getPctProdComplete()" />
      </div>
      <div v-show="showDebuggingInfo">
        <p class="display-5 mt-4">{{ last_code }}</p>
        <p>{{ getQRURL() }}</p>
      </div>
      <p class="display-5 mt-4">{{ availableTokens }} drink(s) remaining.</p>
    </div>
    <!-- Tokens not available -->
    <div v-show="!isRefreshing || availableTokens === 0">
      <div class="mb-2 timerContainer">
        <p style="text-align: center" class="display-3 mt-4 mb-4">We are making drinks!</p>
        <transition name="fade" class="pl-2 mr-2">
          <Timer :time="remaining_ms" class="center"/>
        </transition>
        <p class="display-6 mb-4">We will accept new orders soon.</p>
      </div>
    </div>
  </div>
</template>

<script>
/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

'use strict'

import axios from 'axios'
import Auth from '@aws-amplify/auth'
import QrcodeVue from 'qrcode.vue'
import Timer from '@/components/BaseTimer'

// Period between the end of a bucket that barcode is hidden for
const INTERVAL_HIDE_MS = 15000
const REFRESH_TIME_INTERVAL_MS = 300000

// Timer interval to calculate remaining period
const REFRESH_MS = 1000
const QR_PREFIX = 'https://main.d40jtd1j0gedq.amplifyapp.com?token='

export default {
  name: 'QRcode',

  data() {
    return {
      last_code: '',
      size: 300,
      end_ts: 0,
      isRefreshing: false,
      remaining_ms: 0,
      availableTokens: 0,
      isActive: false,
      intervalRef: undefined
    }
  },
  components: {
    QrcodeVue,
    Timer
  },
  mounted () {
    console.log('QR code mounted')
    const that = this

    this.emitter.on('authStateChanged', (authData) => {
      console.log('QR::bus:', authData)
      if (authData.loggedIn) {
        this.isActive = true
        this.refresh()
        this.intervalRef = setInterval(this.refresh, REFRESH_MS)
        // user signed in
        Auth.currentCredentials().then((info) => {
          console.log('ID: ', info)
        })
      } else {
        // user signed out
        clearInterval(this.intervalRef)
      }
    }),
    // Incoming event - change in token quantity
    this.emitter.on('message', (payloadEnvelope) => {
      console.log('QR event:', payloadEnvelope)

      // Change in token quantity
      if (payloadEnvelope['type'] === 'Validator.NewOrder') {
        if (payloadEnvelope.detail.bucket?.availableTokens) {
          const tokens = payloadEnvelope.detail.bucket.availableTokens
          console.log('Updating token count: ', tokens)
          that.availableTokens = tokens
        }
      }

    })
    this.isActive = true
    this.intervalRef = setInterval(this.refresh, REFRESH_MS)
    this.refresh ()
  },
  methods: {
    toggleDebuggingInfo () {
      this.showDebuggingInfo = !this.showDebuggingInfo
    },
    getQRURL () {
      return `${QR_PREFIX}${this.last_code}`
    },
    getSeconds () {
      return parseInt(this.remaining_ms / 1000)
    },
    // Return 0-100 % for time an order has been in production compared with MAX
    getPctProdComplete() {
      // console.log((this.remaining_ms / REFRESH_TIME_INTERVAL_MS) * 100)
      return (this.remaining_ms / REFRESH_TIME_INTERVAL_MS) * 100
    },
    getQRwidth () {
      return (window.innerWidth / 4.75)
    },
    refresh () {
      // Calc remaining time between the end of the bucket time and now
      this.remaining_ms = this.end_ts - Date.now()
      // Avoid negatives values in the UI
      if (this.remaining_ms < 0) this.remaining_ms = 0
      // console.log(`Reload in ${this.remaining_ms} ms`)

      // Hide the barcode when approaching refresh
      if ( this.remaining_ms <= INTERVAL_HIDE_MS ) {
        this.isRefreshing = false
      }
      // Reload when it expires
      if ( this.remaining_ms <= 0 ) {
        this.loadCode ()
      }
    },
    async loadCode () {
      console.log('loadCode started')

      // Refresh token
      const session = await Auth.currentSession()
      const jwtToken = session.getAccessToken().jwtToken

      // Sensitive info - only log in development
      if (process.env.NODE_ENV==='development') {
        console.log('token: ', jwtToken)
      }

      try {
        const { data } = await axios.get('https://z5u4l3kzib.execute-api.ap-southeast-1.amazonaws.com/Prod/qr-code', { headers: { Authorization: 'Bearer ' + jwtToken }})
        console.log(data)

        this.end_ts = data.bucket.end_ts
        this.last_code = data.bucket.last_code
        this.availableTokens = data.bucket.availableTokens
        this.isRefreshing = true
        this.remaining_ms = this.end_ts - Date.now()
      } catch (err) {
        console.log("Cannot load code: ", err)
        // setInterval(this.refresh, REFRESH_MS)
      }
    }
  }
}
</script>

<style scoped>
div {
  align-items: center;
  padding: 4px;
  justify-content: center;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.center {
  text-align:center;
}
.timerContainer {
  display:flex;
  flex-flow: column nowrap;
  align-items:center;
  justify-content:center;
}
.tokenContainer {
  padding-top:20px;
  padding-bottom:20px;
  background:white;
  border-radius:5px;
}
</style>

<template>
  <div>
    <va-navbar color="dark" v-if="authState === 'signedin'">
      <template #left>
        <va-navbar-item class="mr-4">
          <div>Barista</div>
        </va-navbar-item>
      </template>
      <template #center>
        <va-navbar-item class="mr-4">
          <va-button :rounded="false" :loading="isStoreChangingState" color="info" @click="storeSwitchChange" >
            {{ getStoreStateButtonLabel }}
          </va-button>
        </va-navbar-item>
        <va-navbar-item>
          <va-switch color="success" label="left" left-label v-model="robotEnabled" @update:model-value="toggleRobot" class="ml-4" >
            Robot
          </va-switch>
        </va-navbar-item>
        <va-navbar-item class="mr-4">
          <va-slider v-if="robotEnabled" style="min-width: 150px;" label="Robot speed" v-model="robotSpeed" color="success"/>
        </va-navbar-item>
        <va-navbar-item class="mr-4" v-show="!isEditingPrinter">
          <va-button :rounded="false" color="info" @click="printerChange" >
            {{ getPrinterButtonLabel }}
          </va-button>
        </va-navbar-item>
        <!-- Edit printer IP -->
        <va-navbar-item v-show="isEditingPrinter">
          <va-input
            v-model="printerIPaddress"
            placeholder="Printer IP address"
          />
        </va-navbar-item>
        <va-navbar-item class="mr-4" v-show="isEditingPrinter">
          <va-button :rounded="false" color="info" @click="printerSaveChange" >
            Save
          </va-button>
        </va-navbar-item>

      </template>
      <template #right>
        <va-navbar-item>
          <va-button color="primary" :rounded="false"  @click="signOut">Sign out</va-button>
        </va-navbar-item>
      </template>
    </va-navbar>

    <!-- Only show if logged out -->
    <div v-if="authState != 'signedin'">
      <Authentication/>
    </div>
    <!-- Only show if logged in -->
    <div v-if="authState === 'signedin'">
      <OrderSelector />
    </div>
    <IoT />
    <Printing />
  </div>
</template>

<script>
/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

'use strict'

import IoT from '@/components/IoT'
import OrderSelector from '@/components/OrderSelector'
import Printing from '@/components/Printing'
import Authentication from '@/components/Auth'

import { Auth } from 'aws-amplify'

import axios from 'axios'

const ROBOT_INTERVAL_MS = 30000

export default {
  name: 'App',
  components: {
    IoT,
    OrderSelector,
    Printing,
    Authentication
  },
  data() {
    return {
      // Auth
      user: undefined,
      authState: undefined,
      unsubscribeAuth: undefined,

      // Store open toggle
      isStoreOpen: false,
      isStoreChangingState: false,

      // Edit printer toggle
      isEditingPrinter: false,
      printerIPaddress: undefined,

      // Robot status
      robotEnabled: false,
      robotSpeed: 0,
      intervalref: undefined
    }
  },
  computed: {
    getStoreStateButtonLabel: function () {
      const label = this.isStoreOpen ? 'Close store' : 'Open store'
      console.log('getStoreStateButtonLabel: ', this.isStoreOpen, label)
      return label
    },
    getPrinterButtonLabel: function () {
      const label = 'Printer: ' + (this.printerIPaddress || 'None')
      return label
    }
  },
  methods: {
    async toggleRobot () {
      console.log('toggleRobot: ', this.robotEnabled)
      if (this.robotEnabled) {
        this.intervalref = setInterval(() => (this.emitter.emit('startRobot', this.robotSpeed)), ROBOT_INTERVAL_MS)
      } else {
        clearInterval (this.intervalref)
      }
    },
    async storeSwitchChange () {
      console.log('storeSwitchChange: ', this.isStoreOpen)

      this.isStoreChangingState = true
      this.robotEnabled = false
      this.toggleRobot ()

      // Refresh token
      const session = await Auth.currentSession()
      const jwtToken = session.getAccessToken().jwtToken
      const requestedStoreState = (this.isStoreOpen ? 'closed' : 'open')

      try {
        const { data } = await axios({
          method: 'PUT',
          mode: 'no-cors',
          url: `${this.$APIconfigURL}/store?state=${requestedStoreState}`,
          headers: {
            Authorization: 'Bearer ' + jwtToken
          }
        })
        console.log('storeSwitchChange: ', data)
      } catch (err) {
        console.error("Cannot change state: ", err)
        this.isStoreChangingState = false
      }
    },
    printerChange () {
      console.log('printerChange start')
      this.isEditingPrinter = true
    },
    printerSaveChange () {
      console.log('printerSaveChange: ', this.printerIPaddress)
      localStorage.printerIPaddress = this.printerIPaddress
      this.isEditingPrinter = false
    },
    // Get application config
    async getConfig () {
      console.log('getConfig started')

      try {
        const { data } = await axios(`${this.$ConfigEndpoint}`, {
          method: 'GET',
        })
        console.log('Config: ', data)

        data.map((item) => {
          if (item.topic === "config") {
            console.log({item})
            this.isStoreOpen = item.storeOpen
          }
        })
        this.menu = data.filter((item) => item.topic === "menu")[0]

      } catch (err) {
        console.log("Cannot load config: ", err)
      }
    },
    signOut () {
      this.emitter.emit('signOut')
    }
  },
  async mounted () {
    let that = this

    // Login/logout events
    this.emitter.on('authStateChanged', async function(detail) {
      console.log("mounted::authStateChanged: ", detail)
      if (detail.loggedIn) {
        that.authState = "signedin"
        that.user = detail.authData

        // Load store config
        await that.getConfig()
      } else {
        that.authState = ""
      }
      console.log("mounted::authStateChanged: ", that.authState)
    })

    // Store state changed event
    this.emitter.on('storeState', function (detail) {
      console.log('App.vue mounted storeState: ', detail, that.isStoreOpen)
      that.isStoreOpen = detail.NewImage.storeOpen.BOOL
      that.isStoreChangingState = false
    })

    // Get printer IP from local storage
    this.printerIPaddress = localStorage.printerIPaddress
    console.log('printerIPaddress: ', this.printerIPaddress)
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

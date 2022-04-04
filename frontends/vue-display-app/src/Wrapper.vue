<template>
  <IoT />
  <div v-if="authState === 'signedin' && user">
    <va-navbar color="dark" class="mb-2">
      <template #left> </template>
      <template #center>
        <va-navbar-item>
          <p
            style="text-align: center; color:white;"
            class="display-4 mt-4 mb-4"
          >
            Sign up at
            <span style="color:#08c18a;">https://s12d.com/coffee</span> then
            Scan the QR Code to start
          </p>
        </va-navbar-item>
      </template>
      <template #right>
        <va-navbar-item>
          <va-button color="primary" :rounded="false"  @click="signOut">Sign out</va-button>
        </va-navbar-item>
      </template>
    </va-navbar>

    <!-- Display area -->
    <div class="container mx-2">
      <div class="a">
        <!-- Logo -->
        <div class="mb-4 ml-1">
          <va-image
            :ratio="1.75"
            :src="this.$appLogo"
          />
        </div>
         <div v-if="storeOpen">
          <QR />
        </div>
        <div v-else>
          <div class="div" style="min-width:400px;">
            <div
              class="mb-4"
              style="min-height: 380px; border: solid 12px #dedede; background:white;"
            >
              <transition name="fade" class="mb-4 ml-4 mr-4">
                <lottie-animation
                  ref="anim"
                  :animationData="
                    require('@/assets/1656-closed-open-outline-edited.json')
                  "
                  :autoPlay="true"
                  :loop="false"
                />
              </transition>
              <p style="text-align: center; padding:5px; ">
                The store is not taking orders right now
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="b">
        <UpcomingOrders />
      </div>
      <div class="c">
        <CompletedOrders />
      </div>
    </div>
  </div><!-- container -->
  <!-- Only show if logged out -->
  <div v-show="authState != 'signedin'">
    <Authentication />
  </div>
</template>

<script>

/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

'use strict'

import IoT from "@/components/IoT"
import UpcomingOrders from "@/components/UpcomingOrders"
import CompletedOrders from "@/components/OrderPickup"

import axios from "axios"
import QR from "./components/QR.vue"
import Authentication from "./components/Auth"

//import LottieAnimation from "lottie-vuejs/src/LottieAnimation.vue"; // import lottie-vuejs
import LottieAnimation from "lottie-web-vue/src/lottie-web-vue.vue";

// Timer interval to calculate remaining period

export default {
  name: "App",
  components: {
    QR,
    IoT,
    UpcomingOrders,
    CompletedOrders,
    LottieAnimation,
    Authentication,
  },
  data() {
    return {
      // Auth
      user: undefined,
      authState: undefined,
      unsubscribeAuth: undefined,

      minimized: false,
      menu: undefined,
      config: undefined,
      intervalRef: undefined,
      eventsArray: [],
      storeOpen: true,
    }
  },
  async mounted() {
    console.log("App mounted")
    let that = this

    // Login/logout events
    this.emitter.on("authStateChanged", async function(detail) {
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
    this.emitter.on("storeState", function(detail) {
      console.log("App.vue mounted storeState: ", detail, that.isStoreOpen);
      that.isStoreOpen = detail.NewImage.storeOpen.BOOL
      that.isStoreChangingState = false;
    })

    this.emitter.on("message", async (data) => {
      this.eventsArray.push(data);
      if (data.type == "ConfigService.ConfigChanged") {
        this.storeOpen = data.detail.NewImage.storeOpen.BOOL
        console.log("STORE CHANGE", data.detail.NewImage.storeOpen.BOOL);
      }
    })
  },
  methods: {
    // Get application config
    async getConfig() {
      console.log("getConfig started");
      try {
        const { data } = await axios.get(`${this.$ConfigEndpoint}`);
        console.log("Config: ", data);

        data.map((item) => {
          if (item.topic === "config") {
            console.log({ item });
            this.storeOpen = item.storeOpen;
          }
        });
      } catch (err) {
        console.log("Cannot load config: ", err);
      }
    },
    signOut () {
      this.emitter.emit('signOut')
    }
  }
}
</script>

<style lang="scss">
.signout-button {
  position: absolute;
  bottom: 2px;
  right: 2px;
  z-index: 999;
}

.container {
  display: grid;
  grid-template-columns: minmax(0, 2fr) 3fr 3fr;
  grid-template-rows: auto;
  gap: 20px 20px;
  grid-template-areas: "a b c";
  height: 92vh;
}

.a {
  grid-area: a;
}
.b {
  grid-area: b;
}
.c {
  grid-area: c;
}

body {
  margin: 0;
  background: #868686;
  min-height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

<template>
  <va-card :bordered="false" style="height: 100% !important;">
    <va-card-title><h1>Ready</h1></va-card-title>
    <va-card-content>
      <div class="twoColContainer">
        <va-list-item
          style="width: 49%;"
          v-for="(order, index) in orders"
          :key="order.orderId"
        >
          <transition name="fade" v-if="index <= 13">
            <div v-if="order.orderNumber">
              <div class="row">
                <div class=" md4">
                  <span style="font-size:52px; padding:10px; color:#08c18a;">{{
                    order.orderNumber
                  }}</span>
                </div>
                <div class="md4 offset--md4" style="text-align:left">
                  <strong style="font-size:30px;"
                    >{{ order.orderItemName }}
                  </strong>
                  <br />
                  <p class="timer">{{ order.displayAge }}</p>
                </div>
              </div>
              <va-list-separator spaced />
            </div>
          </transition>
        </va-list-item>
      </div>
    </va-card-content>
  </va-card>
</template>

<script>
/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

'use strict'

import axios from "axios"
import Auth from "@aws-amplify/auth"
const MAX_ORDER_AGE_SECONDS = 600

export default {
  name: "OrderPickup",
  data() {
    return {
      interval: undefined,
      orders: [],
    }
  },
  async mounted() {
    let that = this
    this.interval = setInterval(() => that.refreshData(), 1000)

    this.emitter.on("COMPLETED", function(obj) {
      console.log("COMPLETED ", obj)
      obj.completedtime = Date.now()
      that.orders.push(obj)
    })
    await this.loadOrders()
  },
  methods: {
    async loadOrders() {
      console.log("loadOrders started")

      // Refresh token
      const session = await Auth.currentSession()
      const jwtToken = session.getAccessToken().jwtToken

      try {
        const { data } = await axios.get(`${this.$ordersAPIurl}/orders?state=COMPLETED`,
          {
            headers: { Authorization: "Bearer " + jwtToken },
          }
        )
        console.log("Pickup orders", data)

        data.result.map((order) => {
          if (order.drinkOrder) {
            this.orders.push({
              orderId: order.SK,
              orderNumber: order.orderNumber,
              customerName: "Name",
              orderItemName: order.drinkOrder.drink,
              icon: order.drinkOrder.icon,
              modifiers: order.drinkOrder.modifiers,
              startTime: order.TS, //Date.now() - 10000,
              completedtime: order.TS,
              state: "COMPLETED",
              age: 0,
            })
          }
        })
      } catch (err) {
        console.log("Cannot load orders: ", err)
      }
    },
    // Convert age in seconds to string with mins/secs
    getMinsSecs(age) {
      try {
        // Minutes and seconds
        const mins = ~~(age / 60)
        const secs = ~~age % 60

        // Only return mins if more than a minute
        let min = ""
        if (mins > 0) min = mins + "m "
        // console.log(age, min, secs, min + secs + "s")
        return min + secs + "s"
      } catch (err) {
        console.log("getMinsSecs error", err)
        return ""
      }
    },
    refreshData() {
      // Update ticket age
      for (let i = 0; i < this.orders.length; i++) {
        this.orders[i].age = parseInt ((Date.now() - this.orders[i].completedtime) / 1000 )
        this.orders[i].displayAge = this.getMinsSecs(this.orders[i].age)
      }
      // Remove any older orders
      this.orders = this.orders.filter((order) => (order.age <= MAX_ORDER_AGE_SECONDS))
    }
  }
}
</script>

<style>
h1 {
  font-size: 4em;
}
.va-avatar img,
.va-avatar svg {
  width: inherit;
  top: -3px;
  position: relative;
}

.va-list-item-section {
  display: inline-block !important;
}

.va-list-item-section > * {
  text-align: left !important;
}

.va-list-item-label {
  font-size: 1.5em !important;
}
.va-list-item-label.smaller {
  font-size: 1em !important;
}

.twoColContainer {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>

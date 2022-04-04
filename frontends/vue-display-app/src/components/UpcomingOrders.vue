<template>
  <va-card :bordered="false" style="height:100% !important;">
    <va-card-title><h1>Preparing</h1></va-card-title>
    <va-card-content>
      <div class="twoColContainer">
        <va-list-item style="width: 49%;" v-for="(order, index) in previews" :key="order.orderId">
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
      </div><!-- twoColContainer -->
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

export default {
  name: "UpcomingOrders",
  data() {
    return {
      interval: undefined,
      orders: [],
    }
  },
  computed: {
    // Enables v-for loop on filtered list of orders
    previews: function() {
      // console.log('previews:',this.orders.filter((order) => order.state === 'preview'))
      return this.orders.filter((order) => order.state === "preview");
    },
  },
  async mounted() {
    let that = this
    this.interval = setInterval(() => that.refreshData(), 1000);

    this.emitter.on("message", function(obj) {
      console.log("Validator::newOrder: ", obj)

      if (obj.type == "OrderManager.OrderCompleted") {
        for (let v of that.orders) {
          if (v.orderId == obj.detail.orderId) {
            v.state = "COMPLETED";
            that.emitter.emit("COMPLETED", v)
          }
        }
        return
      }

      if (obj.type == "OrderManager.OrderCancelled") {
        for (let v of that.orders) {
          if (v.orderId == obj.detail.orderId) {
            v.state = "CANCELLED"
            delete (that.orders, v)
          }
        }
        return
      }

      if (obj.type == "OrderProcessor.OrderTimeOut") {
        for (let v of that.orders) {
          if (v.orderId == obj.detail.orderId) {
            v.state = "CANCELLED"
            delete (that.orders, v)
          }
        }
        return
      }

      if (obj.type == "OrderManager.WaitingCompletion") {
        // Add order
        that.orders.push({
          orderId: obj.detail.orderId,
          orderNumber: obj.detail.orderNumber,
          customerName: "Name",
          orderItemName: obj.detail.drinkOrder.drink,
          icon: obj.detail.drinkOrder.icon,
          modifiers: obj.detail.drinkOrder.modifiers,
          startTime: obj.detail.TS, //Date.now() - 10000,
          state: "preview",
          age: 0
        })
      }
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
        const { data } = await axios.get(`${this.$ordersAPIurl}/orders?state=CREATED`, {
          headers: { Authorization: "Bearer " + jwtToken }
        })
        console.log("orders", data)

        data.result.map((order) => {
          console.log("Order:", order);
          this.orders.push({
            orderId: order.SK,
            orderNumber: order.orderNumber,
            customerName: "Name",
            orderItemName: order.drinkOrder.drink,
            icon: order.drinkOrder.icon,
            modifiers: order.drinkOrder.modifiers,
            startTime: order.TS, //Date.now() - 10000,
            state: "preview",
            age: 0
          })
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
        return min + secs + "s"
      } catch (err) {
        console.log("getMinsSecs error", err)
        return ""
      }
    },
    refreshData() {
      // Update ticket age
      for (let i = 0; i < this.orders.length; i++) {
        this.orders[i].age = parseInt ((Date.now() - this.orders[i].startTime) / 1000 )
        this.orders[i].displayAge = this.getMinsSecs(this.orders[i].age)
      }
    }
  }
}
</script>

<style>
.va-list-item-label {
  font-size: 2em !important;
}
.va-list-item-label.smaller {
  font-size: 1em !important;
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

h1 {
  font-size: 40px !important;
}

.twoColContainer {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>

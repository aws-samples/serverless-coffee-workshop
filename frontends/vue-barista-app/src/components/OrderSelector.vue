<template>
    <va-modal
      v-model="showConfirmModal"
      size="medium"
      title="Confirmation"
      message="Are you sure you want to cancel this order?"
      okText="Yes"
      cancelText="No"
      @ok="cancelOrderOKclick"
    />
  <div>
    <va-card color="background" style="padding: .25rem;">
      <div class="row">
        <div class="flex md4 lg4 column-container">
          <!-- PREVIEW COLUMN -->
          <div class="display-5 mb-4">Preview</div>
          <div class="row">
            <div v-for="order in previews" :key="order.orderId" class="flex md12 lg12" v-show="showButtonsOnOrder(order.baristaUserId)">
              <transition name="fade">
                <va-card stripe :stripe-color="getSeverityColor(order.age)" class="mb-4">
                  <!-- Order info -->
                  <div class="orderNumber">#{{ order.orderNumber }}</div>
                  <div v-if="order.robot" class="orderRobot">ROBOT</div>
                  <div class="orderItem">{{ order.orderItemName }}</div>
                  <div class="orderModifiers"> {{ getModifiers(order.modifiers) }}</div>
                  <!-- Buttons -->
                  <div class="buttons">
                    <va-button color="danger" icon="block" :rounded="false" @click="cancelOrderClick(order)">Cancel</va-button>
                    <!-- <va-button flat :rounded="false" :disabled="true">{{ getMinsSecs (order.age) }}</va-button> -->
                    <span class="timer">{{ getMinsSecs (order.age) }}</span>
                    <va-button
                      color="success"
                      icon="arrow_circle_right"
                      :rounded="false"
                      :disabled="order.isMoving"
                      @click="makeOrderClick(order.orderId, 'make')">
                        Make
                    </va-button>
                  <!-- <va-button class="mb-2" icon="clear">Clear</va-button> -->
                  </div>
                </va-card>
              </transition>
            </div>
          </div>
        </div>
        <div class="flex md4 lg4 column-container">
          <!-- PRODUCTION COLUMN -->
          <div class="display-5 mb-4">Production</div>
          <div class="row">
            <div v-for="order in production" :key="order.orderId" class="flex md12 lg12">
              <transition name="fade">
                <va-card stripe :stripe-color="getSeverityColor(order.age)" class="mb-4">
                  <!-- Order info -->
                  <div class="orderNumber">#{{ order.orderNumber }}</div>
                  <div class="orderItem">{{ order.orderItemName }}</div>
                  <div class="orderModifiers"> {{ getModifiers(order.modifiers) }}</div>
                  <!-- Buttons -->
                  <div class="buttons">
                    <va-button color="danger" icon="block" :rounded="false" @click="makeOrderClick(order.orderId, 'unmake')">Unmake</va-button>
                    <!-- <va-button flat :rounded="false" :disabled="true">{{ getMinsSecs (order.age) }}</va-button> -->
                    <span class="timer">{{ getMinsSecs (order.age) }}</span>
                    <va-button  color="success" icon="arrow_circle_right" :rounded="false" @click="pickupClick(order.orderId)">Pickup</va-button>
                  <!-- <va-button class="mb-2" icon="clear">Clear</va-button> -->
                  </div>

                  <!-- <p class="timer" style="padding-bottom: 6px;">{{ getMinsSecs (order.age) }}</p>
                  <va-progress-bar :model-value="getPctProdComplete(order.timeInProd)" /> -->
                </va-card>
              </transition>
            </div>
          </div>
        </div>
        <div class="flex md4 lg4 column-container">
          <!-- PICKUP COLUMN -->
          <div class="display-5 mb-4">Pickup</div>
          <div class="row">
            <div v-for="order in pickup" :key="order.orderId" class="flex md12 lg12">
              <transition name="fade">
                <va-card class="mb-4">
                  <div class="orderNumber">#{{ order.orderNumber }}</div>
                  <div class="orderItem">{{ order.orderItemName }}</div>
                  <div class="orderModifiers"> {{ getModifiers(order.modifiers) }}</div>
                </va-card>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </va-card>
  </div>
</template>

<script>
/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

'use strict'

const TIME_IN_PROD_MAX = 5 //60
const MAX_TIME_IN_PICKUP = 60
const MAX_AGE_LOADED_ORDERS = 300 // 5mins

import axios from 'axios'
import Auth from '@aws-amplify/auth'

export default {
  name: 'OrderSelector',
  data() {
    return {
      // interval handle
      interval: undefined,
      // Orders
      orders: [],
      // Cancellation logic
      showConfirmModal: false,
      orderIDtoCancel: undefined,
      // Current user
      sub: ''
    }
  },
  computed: {
    // Enables v-for loop on filtered list of orders
    previews: function () {
      return this.orders.filter((order) => order.state === 'preview').sort((a,b) => (a.orderNumber > b.orderNumber) ? 1 : -1)
    },
    production: function () {
      return this.orders.filter((order) => order.state === 'production').sort((a,b) => (a.orderNumber > b.orderNumber) ? 1 : -1)
    },
    pickup: function () {
      return this.orders.filter((order) => order.state === 'pickup').sort((a,b) => (a.orderNumber > b.orderNumber) ? 1 : -1)
    }
  },
  async mounted () {
    let that = this
    this.interval = setInterval(() => that.refreshData(), 1000)

    // New order arrives
    this.emitter.on('newOrder', function (detail) {
      console.log('OrderSelector::newOrder: ', detail)

      // Check if existing
      for (let i = 0; i < that.orders.length; i++) {
        if (that.orders[i].orderId === detail.orderId) {
          console.log('Exists: ', detail, that.orders[i].orderId)
          that.orders[i].orderNumber = detail.orderNumber
          return
        }
      }

      // Add order
      that.orders.push({
        orderId: detail.orderId,
        orderNumber: detail.orderNumber,
        customerName: detail.userId,
        robot: detail.robot,
        orderItemName: detail.drinkOrder?.drink,
        modifiers: detail.drinkOrder?.modifiers,
        startTime: detail.TS, //Date.now() - 10000,
        state: 'preview',
        age: 0
      })

      // Sort by orderNumber
      that.orders.sort((a,b) => (a.orderNumber < b.orderNumber))
    })

    // Order cancellation arrives
    this.emitter.on('cancelOrder', function (detail) {
      console.log('OrderSelector::cancelOrder: ', detail)
      // Remove this order from the internal order list
      that.orders = that.orders.filter((order) => (order.orderId != detail.orderId))
    })

    // Order timeouts in the workflow
    this.emitter.on('timeoutOrder', function (detail) {
      console.log('OrderSelector::timeoutOrder: ', detail)
      // Remove this order from the internal order list
      that.orders = that.orders.filter((order) => (order.orderId != detail.orderId))
    })

    // Order completion arrives
    this.emitter.on('completeOrder', function (detail) {
      console.log('OrderSelector::completeOrder: ', detail)

      // Move to pickup lane
      for (let i = 0; i < that.orders.length; i++) {
        if (that.orders[i].orderId === detail.orderId) {
          console.log('Moving to pickup: ', that.orders[i].orderId)
          that.orders[i].state = 'pickup'
          that.orders[i].age = 0
          that.orders[i].timeInProd = 0
        }
      }
    })

    // Make order arrives
    this.emitter.on('makeOrder', function (detail) {
      console.log('OrderSelector::makeOrder: ', detail, that.sub)

      // Move to pickup lane
      for (let i = 0; i < that.orders.length; i++) {
        if (that.orders[i].orderId === detail.orderId) {
          console.log('Updating barista ID: ', that.orders[i].orderId, detail.baristaUserId)
          that.orders[i].state = (detail.baristaUserId === that.sub)  ? 'production' : 'preview'
          that.orders[i].baristaUserId = detail.baristaUserId
          that.orders[i].isMoving = false
        }
      }
    })

    // Run the robot
    this.emitter.on('startRobot', async (robotSpeed) => {
      const totalOrders = this.previews.length
      console.log('OrderSelector::startRobot: speed=', robotSpeed, totalOrders)

      let robotFills = 0
      for (let i = 0; i < this.previews.length; i++) {
        if (this.previews[i].robot) {
          console.log('Completing: ', this.previews[i].orderId, robotFills)
          this.pickupClick(this.previews[i].orderId)
          robotFills++
          if ((robotFills / totalOrders) >= (robotSpeed / 100)) {
            break;
          }
        }
      }
    })

    await this.loadOrders ()
  },
  methods: {
    showButtonsOnOrder (baristaId) {
      if (!baristaId || baristaId === this.sub) return true
      return false
    },
    async loadOrders () {
      console.log('loadOrders started')

      // Refresh token
      const session = await Auth.currentSession()
      const jwtToken = session.getAccessToken().jwtToken
      this.sub = session.getIdToken().payload.sub

      console.log('token: ', jwtToken)
      try {
        // Open orders
        const open = await axios.get(`${this.$APIurl}/orders?state=CREATED`, { headers: { Authorization: 'Bearer ' + jwtToken }})
        console.log('Open orders:', open)

        open.data.result.map((order) => {
          let newOrder = {}
          if (order.orderNumber) {
            newOrder = {
              orderId: order.SK,
              baristaUserId: order.baristaUserId,
              orderNumber: order.orderNumber,
              customerName: '',
              robot: order.robot,
              orderItemName: order.drinkOrder?.drink,
              modifiers: order.drinkOrder?.modifiers,
              startTime: order.TS,
              state: 'preview',
              age: 0
            }

            if (order.baristaUserId) {
              // If barista order ID is the current sub, this order is owner by this user
              if (order.baristaUserId === this.sub) {
                newOrder.state = 'production'
                newOrder.timeInProd = 0
              }
            }
            this.orders.push(newOrder)
          }
        })

        // Completed
        const completed = await axios.get(`${this.$APIurl}/orders?state=COMPLETED&maxItems=10`, { headers: { Authorization: 'Bearer ' + jwtToken }})
        console.log('Completed orders:', completed)

        completed.data.result.map((order) => {
          // console.log((Date.now() - order.TS) / 1000, MAX_AGE_LOADED_ORDERS)
          if ((Date.now() - order.TS) / 1000 < MAX_AGE_LOADED_ORDERS) {
            this.orders.push({
              orderId: order.SK,
              orderNumber: order.orderNumber,
              customerName: '',
              robot: order.robot,
              orderItemName: order.drinkOrder?.drink,
              modifiers: order.drinkOrder?.modifiers,
              startTime: order.TS,
              timeInProd: 0,
              state: 'pickup',
              age: 0
            })
          }
        })
      } catch (err) {
        console.log("Cannot load code: ", err)
        // setInterval(this.refresh, REFRESH_MS)
      }
    },
    async orderComplete (order) {
      console.log('orderComplete started:', order)

      // Refresh token
      const session = await Auth.currentSession()
      const jwtToken = session.getAccessToken().jwtToken

      try {
        const { data } = await axios({
          method: 'PUT',
          url: `${this.$APIurl}/orders/complete/${order.orderId}`,
          headers: {
            Authorization: 'Bearer ' + jwtToken
          }
        })
        console.log(data)
      } catch (err) {
        console.error("orderComplete: ", err)
      }
    },
    async orderCancel (orderId) {
      console.log('orderCancel started:', orderId)

      // Refresh token
      const session = await Auth.currentSession()
      const jwtToken = session.getAccessToken().jwtToken

      try {
        const { data } = await axios({
          method: 'PUT',
          url: `${this.$APIurl}/orders/cancel/${orderId}`,
          headers: {
            Authorization: 'Bearer ' + jwtToken
          }
        })
        console.log(data)
      } catch (err) {
        console.error("orderCancel error: ", err)
      }
    },
    // Cancel button pressed
    cancelOrderClick (order) {
      console.log('cancelOrderClick:', order)
      this.orderIDtoCancel = order.orderId
      this.showConfirmModal = true
    },
    async cancelOrderOKclick () {
      console.log('cancelOrderOKclick:', this.orderIDtoCancel)
      await this.orderCancel(this.orderIDtoCancel)
      this.showConfirmModal = false
      this.orderIDtoCancel = undefined
    },
    // Click event for preview column
    async makeOrderClick (orderId, action) {
      console.log('makeOrderClick: ', orderId, action)

      for (let i = 0; i < this.orders.length; i++) {
        if (this.orders[i].orderId === orderId) {
          this.orders[i].state = (action === 'make') ? 'production' : 'preview'
          this.orders[i].timeInProd = 0
          // This disables the Make button to prevent multiple clicks.
          this.orders[i].isMoving = (action === 'make') ? true: false

          // Send ticket to printer if making
          if (action === 'make') {
            this.emitter.emit('printOrder', this.orders[i])
          }
          break
        }
      }

      // Refresh token
      const session = await Auth.currentSession()
      const jwtToken = session.getAccessToken().jwtToken

      try {
        const { data } = await axios({
          method: 'PUT',
          url: `${this.$APIurl}/orders/claim/${orderId}?action=${action}`,
          headers: {
            Authorization: 'Bearer ' + jwtToken
          }
        })
        console.log('Claim response: ', data)
      } catch (err) {
        console.error("makeOrderClick: ", err)
      }
    },
    // Click event for Pickup button
    async pickupClick (orderId) {
      console.log('pickupClick: ', orderId)

      for (let i = 0; i < this.orders.length; i++) {
        if (this.orders[i].orderId === orderId) {
          this.orders[i].state = 'pickup'
          console.log("Moving to Pickup: ", this.orders[i])
          await this.orderComplete(this.orders[i])
          break
        }
      }
    },
    getModifiers(modifiers) {
      if (!modifiers) return ''
      modifiers = modifiers.filter((modifier) => (modifier != 'None'))
      return modifiers.join(' - ')
    },
    // Return 0-100 % for time an order has been in production compared with MAX
    getPctProdComplete(timeInProd) {
      return (100 - (timeInProd / TIME_IN_PROD_MAX) * 100)
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
        console.log('getMinsSecs error', err)
        return ""
      }
    },
    // Class name for stripe
    getSeverityColor(age) {
      if (age < 120 ) return "success"
      if (age < 300 ) return "warning"
      return "danger"
    },
    async refreshData () {
      // Update ticket age
      for (let i = 0; i < this.orders.length; i++) {
        this.orders[i].age = parseInt ((Date.now() - this.orders[i].startTime) / 1000 )

        if (this.orders[i].state === 'production' || this.orders[i].state === 'pickup') {
          this.orders[i].timeInProd++
        }
      }

      // Removed completed orders that have aged out
      this.orders = this.orders.filter((order) => {
        if (order.state === 'pickup') {
          // console.log('Checking pickup: ', order)
          if (order.timeInProd > MAX_TIME_IN_PICKUP) {
            console.log('REMOVING: ', order.state, order.orderId, order.timeInProd, MAX_TIME_IN_PICKUP)
            return false
          }
        }
        return true
      })
    }
  }
}
</script>

<style>
.column-container {
  width: 100%;
  min-height: 88vh;
  border: 1vh solid #4e4e4e;
  box-sizing: border-box;
  padding: 0.5vh;
  background-color: #bbbbbb;
  /* border: 5px 0px 5px 5px; */
}

.timer {
  color: #3b3b3b;
  font-size: 1.4vw;
  font-weight: 700;
  line-height: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.card-title {
    align-items: flex-start;
    display: flex;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: .6px;
    line-height: 1.2;
    text-transform: uppercase;
    padding: 6px;
}
.cancel-button {
  position: absolute !important;
  top: 6px;
  right: 0px;
}
.buttons {
  display: flex;
  justify-content: space-between;
}
.orderNumber {
  font-size: 2.2vw;
  font-weight: 900;
  padding-left: 4px;
  padding-top: 4px;
  display: block;
  float: left;
  position: absolute;
}
.orderItem {
  font-size: 2.2vw;
  font-weight: 900;
  padding-left: 5px;
  padding-top: 4px;
  display: block;
}
.orderRobot {
  font-size: 1.4vw;
  font-weight: 700;
  padding-right: 1px;
  padding-top: 4px;
  position: absolute;
  float:right;
  top: 0;
  right: 0;
}

.orderModifiers {
  font-size: 1.8vw;
  font-weight: 500;
  padding: 10px;
  display: block;
}
</style>

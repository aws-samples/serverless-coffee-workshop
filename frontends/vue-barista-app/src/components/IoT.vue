<template>
  <div></div>
</template>

<script>
/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

'use strict'

/* eslint-disable */
const AWS = require('aws-sdk')
const AWSIoTData = require('aws-iot-device-sdk')

const topics = {
  subscribe: 'serverlesspresso-admin'
}

export default {
  name: 'IoT',
  mounted: async function () {
    const that = this
    this.emitter.on('authStateChanged', async function(detail) {
      console.log("IoT::mounted::authStateChanged: ", detail)
      if (detail.loggedIn) {
        console.log('Mounting websocket')
        that.mountIoT()
        // user signed in
      } else {
        // user signed out
      }
    }),
    this.emitter.on('subscribe', async (topic) => {
      console.log('Request subcription to: ', topic)
      mqttClient.subscribe(topic)
    })
  },
  methods: {
    async getCreds () {
      console.log('getCreds called')
      const cognitoIdentity = new AWS.CognitoIdentity()

      return new Promise((resolve, reject) => {
        AWS.config.credentials.get(function (err) {
          if (!err) {
            console.log('Retrieved identity: ' + AWS.config.credentials.identityId)
            const params = {
              IdentityId: AWS.config.credentials.identityId
            }
            cognitoIdentity.getCredentialsForIdentity(params, function (err, data) {
              console.log('Creds: ', data)
              if (!err) {
                resolve(data)
              } else {
                console.log('Error retrieving credentials: ' + err)
                reject(err)
              }
            })
          } else {
            console.log('Error retrieving identity:' + err)
            reject(err)
          }
        })
      })
    },
    async mountIoT () {
      const that = this
      const AWSConfiguration = {
        poolId: this.$poolId,
        host: this.$host,
        region: this.$region,

      }
      console.log('IoT mounted: ', { AWSConfiguration })

      const clientId = 'serverlesspresso-' + (Math.floor((Math.random() * 100000) + 1))
      AWS.config.region = AWSConfiguration.region
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: AWSConfiguration.poolId
      })

      const creds = await this.getCreds()

      const mqttClient = AWSIoTData.device({
        region: AWS.config.region,
        host: AWSConfiguration.host,
        clientId: clientId,
        protocol: 'wss',
        maximumReconnectTimeMs: 8000,
        debug: false,
        accessKeyId: creds.Credentials.AccessKeyId,
        secretKey: creds.Credentials.SecretKey,
        sessionToken: creds.Credentials.SessionToken
      })

      // When first connected, subscribe to the topics we are interested in.
      mqttClient.on('connect', function () {
        console.log('mqttClient connected: subcribing to ', topics.subscribe)
        mqttClient.subscribe(topics.subscribe)
      })
      // Attempt to reconnect in the event of any error
      mqttClient.on('error', async function (err) {
        console.log('mqttClient error:', err)

        // Update creds
        const data = await that.getCreds()
        mqttClient.updateWebSocketCredentials(data.Credentials.AccessKeyId,
          data.Credentials.SecretKey,
          data.Credentials.SessionToken)

      })

      // A message has arrived - parse to determine topic
      mqttClient.on('message', function (topic, payload) {
        const payloadEnvelope = JSON.parse(payload.toString())
        console.log('IoT::onMessage: ', topic, payloadEnvelope)

        switch (payloadEnvelope.type) {
        case 'OrderManager.WaitingCompletion':
          that.emitter.emit('newOrder', payloadEnvelope.detail)
          break
        case 'ConfigService.ConfigChanged':
          that.emitter.emit('storeState', payloadEnvelope.detail)
          break
        case 'OrderManager.OrderCancelled':
          that.emitter.emit('cancelOrder', payloadEnvelope.detail)
          break
        case 'OrderManager.OrderCompleted':
          that.emitter.emit('completeOrder', payloadEnvelope.detail)
          break
        case 'OrderManager.MakeOrder':
          that.emitter.emit('makeOrder', payloadEnvelope.detail)
          break
        case 'OrderProcessor.OrderTimeOut':
          that.emitter.emit('timeoutOrder', payloadEnvelope.detail)
          break
        }
      })
    }
  }
}
</script>
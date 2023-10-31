<template>
  <div>  
  </div>
</template>

<script>
/* eslint-disable */
const AWS = require('aws-sdk')
const AWSIoTData = require('aws-iot-device-sdk')
const topics = [
  'serverlesspresso-config',
  'serverlesspresso-user-{SUB}'
]


   

export default {
  name: 'IoT',
  mounted: async function () {
    const that = this
    this.emitter.on('authStateChanged', async function(detail) {
      console.log("IoT::mounted::authStateChanged: ", detail)
      if (detail.loggedIn) {
        console.log('Mounting websocket')
        that.mountIoT(detail)
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
    async mountIoT (authData) {
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
        console.log('mqttClient connected',authData.authData.accessToken.payload.sub)  
        topics.forEach(topic =>  mqttClient.subscribe(topic.replace('{SUB}',authData.authData.accessToken.payload.sub)))
        
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
        that.emitter.emit('message', payloadEnvelope)
      })
    }
  }
}
</script>
<template>
  <div class="row parent">
    <div class="flex md6 lg6">
        <va-card :bordered="false" style="margin-top: 20px;">
          <va-card-title>Add your backend settings</va-card-title>
          <va-card-content>Enter the environment variables and stack parameters from your backend.</va-card-content>

          <!-- Fields -->
          <div class="row flex" style="margin: 20px;">
            <va-input
              style="font-size: 24px;"
              label="Region (e.g. us-west-2)"
              v-model.trim="region"
            />
          </div>
          <div class="row flex" style="margin: 20px;">
            <va-input
              style="font-size: 24px;"
              label="API URL"
              v-model.trim="APIurl"
            />
          </div>
          <div class="row flex" style="margin: 20px;">
            <va-input
              style="font-size: 24px;"
              label="Config URL"
              v-model.trim="ordersAPIurl"
            />
          </div>
          <div class="row flex" style="margin: 20px;">
            <va-input
              style="font-size: 24px;"
              label="Host"
              v-model.trim="host"
            />
          </div>
          <div class="row flex" style="margin: 20px;">
            <va-input
              style="font-size: 24px;"
              label="Config endpoint"
              v-model.trim="ConfigEndpoint"
            />
          </div>
          <div class="row flex" style="margin: 20px;">
            <va-input
              style="font-size: 24px;"
              label="User Pool Client Id"
              v-model.trim="poolId"
            />
          </div>

          <!-- Save button -->
          <div class="row flex">
            <div class="row flex" style="margin: 20px;">
              <va-button
                :rounded="false"
                @click="saveLocalStorage"
                class="mr-2">
                  Save and reload
              </va-button>
            </div>
          </div>
        </va-card>
    </div>
  </div>
</template>

<script>
/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

'use strict'

export default {
  name: 'Auth',
  data() {
    return {
      APIurl: '',
      region: '',
      ordersAPIurl: '',
      poolId: '',
      APIconfigURL: '',
      ConfigEndpoint: '',
      host: ''
    }
  },
  async mounted () {
    if (localStorage.UIstate) {
      const UIstate = JSON.parse(localStorage.UIstate)
      console.log('Mounted - Local storage: ', UIstate)
      this.APIurl = UIstate.APIurl || '',
      this.region = UIstate.region || '',
      this.ordersAPIurl = UIstate.ordersAPIurl || '',
      this.poolId = UIstate.poolId || '',
      this.APIconfigURL = UIstate.APIconfigURL || '',
      this.ConfigEndpoint = UIstate.ConfigEndpoint || '',
      this.host = UIstate.host || ''
    }
  },
  methods: {
    saveLocalStorage () {
      const UIstate = {
        APIurl: this.APIurl,
        region: this.region,
        ordersAPIurl: this.ordersAPIurl,
        poolId: this.poolId,
        APIconfigURL: this.APIconfigURL,
        ConfigEndpoint: this.ConfigEndpoint,
        host: this.host
      }
      console.log('Saving Local storage: ', UIstate)

      localStorage.UIstate = JSON.stringify(UIstate)
      console.log('Saving: ', UIstate)
      // Reload page
      window.location.reload()
    }
  }
}
</script>
<style>
.parent {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
}
</style>
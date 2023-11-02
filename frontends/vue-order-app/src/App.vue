<template>
  <div :key="componentKey">
    <va-navbar color="#000000" class="mb-2">
      <template #left>
         <va-navbar-item><img class="logo"  src="https://dltccoffeeimages.s3.amazonaws.com/Gauteng+transport.jpeg"></va-navbar-item> 
      </template>
      <template #center>
        <va-navbar-item>
          <div v-if="authState === 'signedin' && user">

          </div>
        </va-navbar-item>
      </template>
      <template #right>
        <va-navbar-item>
          <div v-if="authState === 'signedin' && user">


          </div>
        </va-navbar-item>
      </template>
    </va-navbar>
    <!-- Only show if logged out -->
    <div v-if="authState != 'signedin'">
      <Authentication/>
    </div>

      <div :key="componentKeySignature" v-if="storeOpen && authState === 'signedin' && user">

             <!-- <div>history={{history}}</div> -->


        <div v-show="loading" class="" style="position:absolute;">
          <br>
          <img class="staus animation"  style="width:50%;" src="https://assets.serverlesscoffee.com/images/1335-qr-code-outline.gif">
          <br>Validating your token
          <!-- <va-progress-circle style="width: 200px;height: 200px;" color='#08c18a' indeterminate /> -->
        </div>

        <div v-if="isHistoryLoaded && history.MaxOrdersReached" v-bind:historyConfig="historyConfig">
          <ReachedLimit v-bind:historyConfig="historyConfig" />
          {{historyObj}}
        </div>
        <div v-if="isHistoryLoaded && !history.MaxOrdersReached"  >
           <!-- <div>loading={{loading}}</div>
           <div>hasToken={{hasToken}}</div>
           <div>displayManager={{displayManager}}</div>
          <div>order.status={{order.status}}</div>
           <div>authState={{authState}}</div>
           <div>signedin={{signedin}}</div>
           <div>orderid={{order.id}}</div>  -->






          <!--<Banner  v-if="displayManager==='' && authState === 'signedin' && user && hasToken ==false && readyToScan==false" @clicked="onReadyToScan" v-bind:historyConfig="historyConfig" />-->
          <!-- <QRScanner v-if="displayManager==='' &&  authState === 'signedin' && user && readyToScan==true" @scanned="onQrScanned" @close="oncloseScanner" /> -->

          <NewBanner  v-if="hasToken===false && authState === 'signedin' && user && !order.id" v-bind:historyConfig="historyConfig" />
          <ProgressBar v-if="displayManager==='choose' && authState === 'signedin' && user && order.id" v-bind:order="order"/>
          <Menu v-if=" displayManager==='choose' && authState === 'signedin' && user && order.id"  @clicked="onSelectDrink" />
          <Extras v-if=" displayManager==='choose' && authState === 'signedin' && user && order.drink!=''" @clicked="onSelectExtra" v-bind:mod="{order:order,menu:menu}"/>
          <Basket v-if="displayManager==='choose' &&  authState === 'signedin' && user " @clicked="onProcessOrder" v-bind:basket="{order:order,user:user}"/>

          <Status :key="order.status" v-if="displayManager==='ordered' && authState === 'signedin' && user && order.id" v-bind:order="order" @completed="onReciept" />
          <Receipt v-if="displayManager==='complete' && authState === 'signedin' && user " v-bind:order="{order:order,historyConfig:historyConfig}" @clicked="init"/>
        </div>


      </div>

      <div v-if="!storeOpen" >

         <lottie-animation
            ref="anim"
            animationData="https://assets.serverlesscoffee.com/images/1656-closed-open-outline-edited.json"
            :autoPlay="true"
            :loop="false"
        />
          <h3>The Store is closed, come back soon</h3>
      </div>

    <IoT />

   <div v-if="order.id" style="height:150px; position:relative;"></div>

     <amplify-sign-out></amplify-sign-out>

  </div>
  <a href="" data-target="html" class="scroll-to-target scroll-to-top"><i class="fa fa-angle-up"></i></a>
</template>

<script>

/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

/* eslint-disable */

const shortbread = AWSCShortbread({
    domain: "workshop-order.serverlesscoffee.com"
  });


import ReachedLimit from '@/components/LimitReached'
// import QRScanner from '@/components/QRScanner'
import IoT from '@/components/IoT'
//import Banner from '@/components/Banner'
import NewBanner from '@/components/newBanner'
import Menu from '@/components/Menu'
import Extras from '@/components/Extras'
import ProgressBar from '@/components/ProgressBar'
import Basket from '@/components/Basket'
import Status from '@/components/Status'
import Receipt from '@/components/Receipt'
import Authentication from '@/components/Auth'


//import LottieAnimation from "lottie-vuejs/src/LottieAnimation.vue"; // import lottie-vuejs
import LottieAnimation from 'lottie-web-vue/src/lottie-web-vue.vue'

import axios from 'axios'
import { Auth } from 'aws-amplify'
import dayjs from 'dayjs'



export default {
  name: 'App',
  components: {

    ReachedLimit,
    //Banner,
    //QRScanner,
    NewBanner,
    IoT,
    Menu,
    Extras,
    Status,
    Basket,
    LottieAnimation,
    ProgressBar,
    Receipt,
    Authentication
  },
  data() {
    return {
      // Auth
      user: undefined,
      authState: undefined,
      unsubscribeAuth: undefined,
      token:undefined,

      loading:true,
      config: undefined,
      historyConfig:{},
      history:{},
      storeOpen: true,
      readyToScan:false,
      hasToken:undefined,
      menu:'',
      componentKey:0,
      componentKeySignature:0,
      displayManager:'',
      order:{
            drink:'',
            signedIn:false,
            status:'',
            icon:'',
            id:'',// put something here for front end
            orderNumber:'',
            extras:[],
            complete:false
          },
    }
  },
  computed:{
    isHistoryLoaded(){
      console.log('history',Object.keys(this.history).length)
      return Object.keys(this.history).length
    }
  } ,
   created() {
  },
  async mounted(){
 // Shows GDPR cookie consent on first load (only if visitor is in affected geography)
     shortbread.checkForCookieConsent();

    let that = this

    // Login/logout events
    this.emitter.on('authStateChanged', async function(detail) {
      console.log("mounted::authStateChanged: ", detail)
      if (detail.loggedIn) {
        that.authState = "signedin"
        that.user = detail.authData
        that.mounter()
        // Load store config
        // await this.getConfig()
      } else {
        that.authState = ""
      }
      console.log("mounted::authStateChanged: ", that.authState)
    })


    this.emitter.on('message', async (data) => {
      console.log('IOT event is:::',data)
      if(data.type!=this.order.status && data.type!='OrderProcessor.orderFinished'){
          this.order.status=data.type
          if(data.detail.orderNumber){
            this.order.orderNumber=data.detail.orderNumber
          }
      }
      if(data.type=='ConfigService.ConfigChanged' ){
        this.storeOpen = data.detail.NewImage.storeOpen.BOOL
        console.log('STORE CHANGE',data.detail.NewImage.storeOpen.BOOL )
      }

      if(data.type=='OrderProcessor.ShopUnavailable'){
         this.storeOpen = false
      }

      if(data.type=='OrderProcessor.OrderTimeOut'){
          this.displayManager='ordered'
          this.order.status ='OrderProcessor.OrderTimeOut'
          this.order.statusinfo = data.detail.cause
      }


      console.log('the order state is now::',this.order.status)

    })
  },

   methods:{


     showCookie () {
        shortbread.customizeCookies();
      },

    async mounter(){

      console.log('prepare to be mounted')
      await this.getConfig()
      await this.getHistory()

      this.history = await this.isMaxOrdersReached(this.historyConfig)
      console.log("gethistory::",this.historyConfig)
        //rehydrate current order has not been completed



          if(this.history.currentOrder){// Is there an order in progress?
              this.order=this.history.currentOrder
              this.order.id = this.history.currentOrder.SK
              this.order.status = this.history.currentOrder.ORDERSTATE

            if(!this.order.drinkOrder){ // there is a current order but no drink
              this.order.status =''
              this.displayManager='choose'
              this.order.extras=[]
            }else{ // There is a current order with drink ..waiting for the order to finish (it already has a dink)
              this.order.status ='OrderProcessor.WaitingCompletion'
              this.displayManager='ordered'
            }
            ///there is no order in progress at all
          }else if(!this.history.MaxOrdersReached){
            console.log('getting an order ID')
              const tokenDerive= await this.deriveToken()
              console.log('tokenDerive',tokenDerive)
              this.order.id =tokenDerive.orderdata
              this.token = tokenDerive.token.value
              this.hasToken = tokenDerive.token.has
              this.displayManager='choose'
          }

           this.loading=false;
    },

    init(){
            this.order={}
            this.order.extras=[]
            this.componentKey += 1;
            this.displayManager=''
            this.hasToken= undefined
          },

          async isMaxOrdersReached(list){
            console.log('LIST:::',list)
            let CustomerStatus = {}


            CustomerStatus.MaxOrdersReached = false

            if(list.result.length){
              let listres = list.result
              let list2 = listres.sort((a, b) => (a.TS > b.TS) ? 1 : -1)
              console.log('list2',list2)
             //get state
                var d = new Date();
                d.setHours(0,0,0,0);
                let todaysMignight = dayjs(d).unix()
                    let entry = list2[list2.length-1]
                    console.log('entery',entry)
                     const EntryTS = entry.TS/1000
                    if (EntryTS > todaysMignight ){
                        if(entry.ORDERSTATE ==='COMPLETED'){

                        if(!list.groups || !list.groups.find(g => g =='admin' )){
                          CustomerStatus.MaxOrdersReached =  true
                        }
                        }else if(entry.ORDERSTATE ==='CREATED'){
                          CustomerStatus.currentOrder = entry
                        }
                    }
                console.log('CustomerStatus',CustomerStatus)
                  }
            return CustomerStatus
    },

          async deriveToken(){
              const queryString = window.location.search;
              const urlParams = new URLSearchParams(queryString)
              const token = urlParams.get('token')
              this.token = token
              let tempToken=''

              let that = this
              const session =  await Auth.currentSession()
              const jwtToken = session.getAccessToken().jwtToken
              var config = {
                  method: 'post',
                  url: 'https://2sprfaybr2.execute-api.us-west-2.amazonaws.com/qr-code?token='+token,
                  headers: {
                      'Authorization': 'Bearer '+jwtToken
                  }
                };

               const orderdata =  await axios(config).then(function (response) {
                      tempToken=true
                      return response.data.orderId
                  }).catch(function (error) {
                    console.log(error)
                    tempToken= false
                });
                return {"orderdata":orderdata,"token":{"has":tempToken,"value":token}}
            },


          onReciept(){
            this.displayManager='complete'
            console.log(this.displayManager)
          },

          onReadyToScan(){
            this.readyToScan = true
            console.log(this.readyToScan)
          },

          oncloseScanner(){
            this.readyToScan = false
          },

          onQrScanned(data){
            this.order.id=data
            console.log(this.order.id)
            this.readyToScan = false
            //this.hasToken=true
            this.displayManager ="choose"
          },

          onProcessOrder(basket){
            console.log(basket)
            this.order.orderNumber = ''
            this.order.status='waiting'
            this.displayManager='ordered'
            console.log(this.order.status)
          },

          onSelectDrink (selected) {
            this.order.drink = selected.drink
            this.menu = selected.menu
            this.order.icon = selected.icon
            console.log(this.order.drink) // someValue

          },
          onSelectExtra (selectedExtras){
            this.order.extras.splice(0, this.order.extras.length)
            let  that=this
            Object.keys(selectedExtras).forEach(function(key) {
                console.log(key, selectedExtras[key]);
                Object.keys(selectedExtras[key]).forEach(function(key2) {
                  that.order.extras.push(key2)
                })
              })
          },
          async getConfig () {
            console.log('getConfig started')
            try {
              const { data } = await axios.get(`${this.$ConfigEndpoint}`)
              console.log('Config: ', data)

              data.map((item) => {
                if (item.topic === "config") {
                  console.log({item})
                  this.storeOpen = item.storeOpen
                }
              })
              //this.menu = data.filter((item) => item.topic === "menu")[0]

            } catch (err) {
              console.log("Cannot load config: ", err)
            }
          },

          async getHistory () {
            const session = await Auth.currentSession()
            const jwtToken = session.getAccessToken().jwtToken
            let that = this
            let config=  {
              method: 'get',
              url: `${this.$orderManagerEndpoint}/myOrders`,
              headers: { Authorization: 'Bearer ' + jwtToken }
            }
            const grabHistory = async () => {
              try {
                const response = await axios(config);
                return response.data
              } catch (error) {
                console.error(error);
              }
            }
            this.historyConfig = await grabHistory()
            this.historyConfig.groups = that.user.accessToken.payload["cognito:groups"]
          },
      }
}
</script>

<style >
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

:root {
  --amplify-primary-color: #000;
  --amplify-primary-tint: #eee;
  --amplify-primary-shade: #fff;
}


</style>
<style scoped>
nav.mb-2, .my-2{margin-bottom:0px !important;}
.logo{max-height:60px;}

@media (max-width:767.98px) {
.logo{max-height:80px;}

 }

.loader{
  position: absolute;
  margin-left: -50px;
  margin-right: -50px;
  top: 10%;
  left: 40%;
}
</style>

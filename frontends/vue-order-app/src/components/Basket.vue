<template>



    
<div class="row">
    <div class="flex  xs12">
      <va-card stripe  v-if="CurrentOrder.drink">
        <va-card-title><h2>Your Order:</h2> </va-card-title>
        <va-card-content>
        <div class="tabed-content">
            <div id="basket">
              <va-card :bordered="false"  outlined>
              <va-list>
                <va-list-label>
                </va-list-label>
                  <va-list-item-section>
                      <va-list-item-label>
                       <u> {{CurrentOrder.drink}}</u>
                    </va-list-item-label>
                  </va-list-item-section>
                <va-list-item
               
                  v-for="item in CurrentOrder.extras" :key="item"
                >
                  <va-list-item-section>
                    <va-list-item-label>
                      {{ item }}
                    </va-list-item-label>
                  </va-list-item-section>
                </va-list-item>
              </va-list>
              </va-card>
            </div>
        </div><!-- /.tabed-content -->
        <va-button :loading="loading" v-if="CurrentOrder.status !='Sent'" @click="sendOrder()" size="large" color="#08c18a" class="mr-1">
            Order Now <va-icon size="large" name="coffee"/>
        </va-button>


        </va-card-content><!-- /.va-card-content -->
        </va-card>
        </div><!-- /.row -->
    </div><!-- /.flex -->
</template>

<script>

import axios from 'axios'
import Auth from '@aws-amplify/auth'

    export default {
      name: "Basket",
      props:['basket'],

      data(){
        return{
          CurrentOrder:this.basket.order,
          CurrentUser:this.basket.user,
          loading:false
        }
      },

   mounted(){

     console.log('MOUNTED::',this.CurrentOrder)
     this.publishJWTtoConsole()
   },

   methods: {

        async publishJWTtoConsole(){
         
           // const ss = await Auth.currentSession()
           // const tt = ss.getAccessToken().jwtToken
            //console.log('jwt:',tt)
        },
            async  sendOrder() {
            this.loading=true;
            const session = await Auth.currentSession()
            const jwtToken = session.getAccessToken().jwtToken
            const that=this

              var data = {
                      "userId":that.CurrentUser.username,
                      "drink":that.CurrentOrder.drink,
                      "modifiers": that.CurrentOrder.extras,
                      "icon": that.CurrentOrder.icon
                  }

              var config = {
                method: 'PUT',
                url: that.$orderManagerEndpoint+'/orders/'+that.CurrentOrder.id,
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization':'Bearer '+jwtToken
                },
                data : JSON.stringify(data)
              };

              console.log('config:',config)

              axios(config)
              .then(function (response) {   

               that.$emit('clicked', {"status":"Sent","orderNumber" : response.data})          
              })
              .catch(function (error) {
                console.log(error);
              });
            },

        }
    }


</script>

<style scoped>
h2{font-size:20px;}
ul{text-align:center;}
ul li{
  margin-top:50px;
  margin-left:5px;
  margin-right:5px;
  list-style:none;
  display:inline-block;
}

a:active {
  background-color: yellow;
}
</style>

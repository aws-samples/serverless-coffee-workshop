<template>
    <div class="row">
        <div class="flex  xs12">
           
            <va-card>
                <va-card-content v-if="journey.result" >
                     <h1>Order <span v-if="CurrentOrder.orderNumber">#{{CurrentOrder.orderNumber}}</span></h1>
                        <h2 v-if="journey.result.drinkOrder"><img width="50" :src="`https://assets.serverlesscoffee.com/images/${journey.result.drinkOrder.icon}.svg`"></h2>
                        <div  class="va-table-responsive">
                            <table class="va-table va-table--striped">
                                <tbody>
                                    <tr  v-if="journey.result.drinkOrder">
                                        <td>Drink:</td>
                                        <td >{{journey.result.drinkOrder.drink}}</td>
                                    </tr>
                                    <tr v-if="journey.result.drinkOrder && journey.result.drinkOrder.modifiers.length">
                                        <td>Modifiers:</td>
                                        <td>{{journey.result.drinkOrder.modifiers.join(', ')}}</td>
                                    </tr>
                                   
                                    <tr  v-if="journey.result.orderState">
                                        <td>Status:</td>
                                        <td>{{journey.result.orderState}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <hr>
                <br><br><br>
                <!-- <va-button @click="restart()" size="large" class="mr-2" space-between-items>
                    <va-icon size="large" name="home" />
                </va-button> -->
                
                <va-button v-if="journey.result" target="blank" :href="journey.result.link"> View order journey </va-button>
                <!--- <History v-bind:orderHistory="previousOrders" /> -->


                <br><br><br>
                <h2>Thanks for using Serverlesspresso. <br><a target="blank" href="https://s12d.com/espresso">Learn</a> how this app was built</h2>
                </va-card-content>

                <div v-else class="flex lg6 xs12 py-4">
                  <va-progress-circle indeterminate />
                </div>

            </va-card> 
            
        </div>
    </div>
</template>


<script>




import axios from 'axios'
import Auth from '@aws-amplify/auth'
//import History from '@/components/History'

    export default {
      name: "Status",
      props:['order'],
      data(){
        return{  
            CurrentOrder:this.order.order,
            previousOrders:this.order.historyConfig,
            journey:{}
        }
      },
      components: {
         // History,
       },

      async mounted(){
         
            const session = await Auth.currentSession()
            const jwtToken = session.getAccessToken().jwtToken
            let that=this

            var config = {
                method: 'GET',
                url: that.$orderManagerEndpoint+'/orders/'+that.CurrentOrder.id,
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization':'Bearer '+jwtToken
                }
              };
              axios(config)
              .then(function (response) {   
               console.log('get the order summary',response.data);
               that.journey =  response.data  
               that.journey.result.link = that.$journeyServiceURL+that.journey.result.orderId+'.html'
               that.toaster(that.journey.result.link)
                
              })
              .catch(function (error) {
                console.log(error);
              });
      },
        methods:{
        restart(){
          this.$emit('clicked')
        },
        toaster(link){
            this.$toast.show(`Learn about your  <a style="color:#08a889;" href="${link}" target="_blank" >order journey</a>`,{position:"top"})
            setTimeout(this.$toast.clear, 6000)
        }
      },

    }
</script>


<style scoped>
h1{font-size: 40px !important;}

table{  
  margin: auto !important;
  }


</style>


<template>


                    <va-button-dropdown
                        class="mr-2 mb-2"
                        outline
                        :close-on-content-click="false"
                        label="History"
                        color="#E788FD"
                        opened-icon="expand_less"
                        
                        
                        >
                         <va-accordion
                                v-model="value"
                                inset
                            >
                                <va-collapse
                                v-for="(order, index) in filteredItems"
                                :key="index"
                                :header="`${order.drinkOrder.drink} ${this.tidyDate(order.TS)}`"
                                >
                                <div >
                                   <img width="50" :src="`https://assets.serverlesscoffee.com/images/${order.drinkOrder.icon}.svg`"> 
                                   <div  class="va-table-responsive">
                                        <table class="va-table va-table--striped">
                                            <tbody>
                                                <tr>
                                                    <td>Drink:</td>
                                                    <td>{{order.drinkOrder.drink}}</td>
                                                </tr>
                                                <tr v-if="order.drinkOrder.modifiers.length">
                                                    <td>Modifiers:</td>
                                                    <td>{{order.drinkOrder.modifiers.join(', ')}}</td>
                                                </tr>
                                              
                                                <tr>
                                                    <td>Status:</td>
                                                    <td>{{order.orderState}}</td>
                                                </tr>
                                                 <tr>
                                                    <td>Order Number:</td>
                                                    <td>{{order.orderNumber}}</td>
                                                </tr>

                                                <tr >
                                                    <td>View your coffee's Journey:</td>
                                                    <td><a target="_blank" :href="$journeyServiceURL+order.SK+'.html'">link</a></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                     
                                </div>
                                </va-collapse>
                            </va-accordion>
                        </va-button-dropdown>
 
                
</template>


<script>

import dayjs from 'dayjs'

    export default {
      name: "Status",
      props:['orderHistory'],
      data(){
          return{
            AllOrders:[]
          }
      },

      computed: {
            filteredItems(){
                return this.AllOrders.filter(e => e.drinkOrder)
            }
      }, 

        methods: {
        tidyDate(date){
            const td= new Date(date)
            return dayjs(td,'dd-mm-YY')
        }
           

        },
        async mounted(){
            if(this.orderHistory){
                 this.AllOrders = this.orderHistory.result
            }
             
        }

    }
</script>


<style scoped>
h1{font-size: 40px !important;}

table{  
  margin: auto !important;
  }


</style>


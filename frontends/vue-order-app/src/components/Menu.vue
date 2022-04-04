<template>



    
<div class="row">
    <div class="flex xs12">
      <va-card >
        <va-card-title><h2>Choose a  serverless drink:</h2> </va-card-title>
        <va-card-content>
        <div class="tabed-content">
            <div id="drinks">
                <div v-if="menuItems.length" class="row">
                    <div class="flex xs4  md6 lg4" v-for="(item,index) in menuItems[0].value" :key="index">
                        <a :class="{highlight:index == selected}" @click='add(item), selected = index'>
                            <va-card :bordered="true"  outlined>
                                <va-card-title>{{item.drink}}</va-card-title>
                                <va-card-content><img width="50" :src="`https://assets.serverlesscoffee.com/images/${item.icon}.svg` "></va-card-content>
                             </va-card>
                        </a>
                    </div>
                </div>
                <div v-else class="flex lg6 xs12 py-4">
                  <va-progress-circle indeterminate />
                </div>
            </div>
        </div><!-- /.tabed-content -->
        </va-card-content><!-- /.va-card-content -->
        </va-card>
        </div><!-- /.row -->
    </div><!-- /.flex -->
</template>

<script>

import axios from 'axios'
import Auth from '@aws-amplify/auth'

    export default {
      name: "Pricing",

      data(){
        return{
           menuItems:{},
           selected:undefined
        }
      },

      methods:{
        add(selected){
          this.$emit('clicked', {"drink":selected.drink,"menu":this.menuItems[0].value, "icon":selected.icon})
        }
      },

      async mounted() {

        const session = await Auth.currentSession()
        const jwtToken = session.getAccessToken().jwtToken
        let that=this

        var config = {
            method: 'GET',
            url: that.$APIGWEndpointConfigService+'/config',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization':'Bearer '+jwtToken
            }
          };
          axios(config)
          .then(function (response) {   
            console.log('get the order summary',response.data);
            that.menuItems =  response.data   
            
          })
          .catch(function (error) {
            console.log(error);
          });
      
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

a.highlight > .va-card{
  background-color:#08c18a !important;
  color:white;
}
</style>

<template>



    
<div v-if="extraItems.length>0" class="row">
    <div class="flex xs12">
      <va-card >
        <va-card-title><h2>Customize order:</h2> </va-card-title>
        <va-card-content>
        <div class="tabed-content">
            <div id="drinks">
                <div class="row">


                <div>
   


  </div>
                  
                    <div class="flex xs12" v-for="(item,index) in extraItems" :key="index">
                        
                         <h2 style="margin-bottom:20px; margin-top:20px;">{{item.Name}}</h2>
                          <div class="xs4  " >
                                  
                                    <va-button outline style="margin:5px; width:50%;" color="#08c18a" v-for="(option,oindex) in item.Options" :key="oindex" @click="add({name:option},{name:item.Name})"  ><span :class="selectedItems[item.Name][option]"> {{option}} </span></va-button>
                                 
                            </div>
                        
                    </div>
                </div>
            </div>
        </div><!-- /.tabed-content -->
                      <img style="width:50px;" src="https://assets.serverlesscoffee.com/images/395-scroll-down-7-auto.7c340762.gif"  alt="Scroll down" />

        </va-card-content><!-- /.va-card-content -->
        </va-card>
        </div><!-- /.row -->
    </div><!-- /.flex -->
</template>

<script>


    export default {
      name: "Extras",

      data(){
        return{
          selectedItems:{},
          currentOrder:null,
          currentMenu:null,
          extraItems:{},
           selected:undefined
        }
      },
      props:['mod'],
      watch:{
          mod: function(newVal, oldVal) { // watch it
            console.log('Prop changed: ', newVal, ' | was: ', oldVal)
            this.refreshExtras()
          }
        },
      methods:{

  
        add(extra,type){
           this.selectedItems[type.name] ={}
            if(!this.selectedItems[type.name][extra.name]){
               this.selectedItems[type.name][extra.name]="highlight"
                this.$emit('clicked', this.selectedItems )
            }
          console.log('selected', this.selectedItems)
        },
        refreshExtras(){
          
            this.currentOrder = this.mod.order
              this.currentMenu = this.mod.menu
                for (let i = 0; i < this.currentMenu.length; i++) {
                  if(this.currentMenu[i].drink == this.currentOrder.drink){
                    this.extraItems = this.currentMenu[i].modifiers
                      for (let j = 0; j < this.currentMenu[i].modifiers.length; j++) {
                        this.selectedItems[this.currentMenu[i].modifiers[j].Name]={}
                      }
                  }
                }
              console.log('extras',this.extraItems)
            }
      },

      mounted() {
        this.refreshExtras()
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

.va-button span.highlight {
  color: black !important;
}
</style>

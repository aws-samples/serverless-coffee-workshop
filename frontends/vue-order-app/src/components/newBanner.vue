<template>
  <section>
    <div class="container">
      <div class="row" style="padding:0px;">
        <div style="text-align:center;" class="flex md12">
          
          <div style="position: relative; min-height:350px;">
            <img style="z-index:9999; width:100%;   left:0px; max-height:333; max-width:333" src="https://assets.serverlesscoffee.com/images/1686-scan-qr-code-outline.d1a19c96.gif"  alt="Coffee Image" />
          </div>
          <div class="banner-one__content">
            <h3>Scan the QR code with your smartphone's camera to start your order<br>
            </h3>
              <History v-bind:orderHistory="previousOrders" />

            <!-- /.banner-one__text -->
           
          </div><!-- /.banner-one__content -->
        </div><!-- /.col-lg-6 -->
      </div><!-- /.row -->
    </div><!-- /.container -->
  </section>
</template>

<script>

import History from '@/components/History'


    export default {
      props:['historyConfig'],
       components: {
          History,
       },
       data(){
         return{
           previousOrders: this.historyConfig
         }
       },
      name: "Banner",
      methods:{
        readyToScan(){
          this.$emit('clicked')
          console.log('onReadyToScan')
        }
      },
      mounted(){
        console.log('banner',this.previousOrders)
      }
    }
</script>

<style scoped>
.banner-one__content{
  padding-right:10px;
  padding-left: 10px;
}
.banner-one__content h3{
font-size: 30px;
margin-bottom:8px;
text-align: center;
}
button{
  margin:5px;
}
</style>

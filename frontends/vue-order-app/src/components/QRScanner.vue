<template>
        <div  class="stream">
            <qr-stream @init="onInit" @decode="onDecode" :video-constraints="{ facingMode: { ideal: 'environment' } }" class="mb">
                 <div class="close" @click="onCloseCamera" >
                    <va-icon
                      name="close"
                      size="large"
                      class="mr-2"
                      color="#ffffff"
                    />  
                </div>   
                <img  class="qroverlay" src="https://assets.serverlesscoffee.com/images/VVqSa.png"> 
                <div style="color: green;" class="frame"></div>
            </qr-stream>
        </div>
</template>


<script>

// Locally
//import { QrStream, } from 'vue3-qr-reader';
import { defineComponent } from "vue";
import { toRefs } from 'vue'
import { reactive } from 'vue'
import Auth from '@aws-amplify/auth'
import axios from 'axios'


export default defineComponent({
  name: 'QrStreamExample',
  components: {
    QrStream
  },
  data(){
    return {
      loading:true,
      fix:false
      }
  },
 
  setup(props,context) {
    const state = reactive({
      data: null,
    })


    function onCloseCamera(){
         context.emit('close')
    }



    async function onDecode(data) {

      const session =  await Auth.currentSession()
      const jwtToken = session.getAccessToken().jwtToken
      var config = {
        method: 'post',
        url: 'https://2sprfaybr2.execute-api.us-west-2.amazonaws.com/qr-code?token='+data,
        headers: { 
            'Authorization': 'Bearer '+jwtToken
        }
        };

        await axios(config)
        .then(function (response) {
        console.log(JSON.stringify(response.data));
            state.data = response.data.orderId
            console.log('emitted')
            context.emit('scanned', state.data)  
        })
        .catch(function (error) {
          console.log(error)
        context.emit('error', '')  
        });
        console.log('here now')
    }

   


    async function onInit (config) {
       window.scrollTo(0,10);
          try {
              await config
            } catch (error) {
              if (error.name === 'NotAllowedError') {
                this.error = "ERROR: you need to grant camera access permission"
              } else if (error.name === 'NotFoundError') {
                this.error = "ERROR: no camera on this device"
              } else if (error.name === 'NotSupportedError') {
                this.error = "ERROR: secure context required (HTTPS, localhost)"
              } else if (error.name === 'NotReadableError') {
                this.error = "ERROR: is the camera already in use?"
              } else if (error.name === 'OverconstrainedError') {
                this.error = "ERROR: installed cameras are not suitable"
              } else if (error.name === 'StreamApiNotSupportedError') {
                this.error = "ERROR: Stream API is not supported in this browser"
              } else if (error.name === 'InsecureContextError') {
                this.error = 'ERROR: Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.';
              
              } else {
                this.error = `ERROR: Camera error (${error.name})`;
               
              }
        }
          console.log('here now')
      }

    return {
      ...toRefs(state),
       onInit,
      onDecode,
      onCloseCamera
     
      
    }
  }
});

</script>


<style scoped>
.error {
  font-weight: bold;
  color: red;
}


.stream{
  position: fixed;
  z-index: 999999999999;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}

.stream {
  background: black;
    top:0px !important;
}
  .qr-stream-camera{

  -webkit-animation: fadein 2s; /* Safari, Chrome and Opera > 12.1 */
       -moz-animation: fadein 2s; /* Firefox < 16 */
        -ms-animation: fadein 2s; /* Internet Explorer */
         -o-animation: fadein 2s; /* Opera < 12.1 */
            animation: fadein 2s;
}

@keyframes fadein {
    from { width: 99%; }
    to   { width: 100%; }
}

/* Firefox < 16 */
@-moz-keyframes fadein {
    from { width: 99%; }
    to   { width: 100%; }
}

/* Safari, Chrome and Opera > 12.1 */
@-webkit-keyframes fadein {
    from { width: 99%; }
    to   { width: 100%; }
}

/* Internet Explorer */
@-ms-keyframes fadein {
    from { width: 99%; }
    to   { width: 100%; }
}

/* Opera < 12.1 */
@-o-keyframes fadein {
    from { width: 99%; }
    to   { width: 100%; }
}

b{color: white; background:black; padding: 10px; margin: 10px; margin-top:30px; position: absolute;}

.qroverlay{width:70%;}


.close:hover{
  cursor: pointer;
}
.close{
font-size: 28px;
background-color:#000000;
top: 20px;
padding-top:10px;
padding-left:10px;
padding-right:3px;
padding-bottom:10px;
left: 20px;
position: absolute;}

.loader{    
  width: 100%;
    height: 100%;
    position: absolute;
    top: 280px;
    background: white;
    margin: auto;
    text-align: center !important;}

.va-progress-circle{margin: auto !important; }

</style>

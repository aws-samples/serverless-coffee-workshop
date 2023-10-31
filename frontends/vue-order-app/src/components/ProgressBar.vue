<template>

            <div class="mt-2 mb-5">
                <div class="my-2 text--bold muted">Time remaining: <span class="ml-4">{{ `${timeRemaining}`}}</span></div>
                <va-progress-bar color="#08c18a" :model-value="percent" />
            </div>
                  
</template>


<script>

    export default {
      name: "ProgressBar",
      props:['order'],
      data(){
        return{  
        countDown : (this.order.TS-(this.order.TS%1000))/1000,
        EndTime : undefined, 
        orderTime: undefined,
        currentTime: undefined,
        percent: 0,
        timeRemaining:300,
        }
      },
      methods:{
      countDownTimer() {
          
             if(this.countDown >0) {
                setTimeout(() => {
                    this.countDown -= 1
                    this.countDownTimer()
                    this.percent= Math.round(this.countDown /300 *100)
                    this.timeRemaining = new Date(this.countDown * 1000).toISOString().substr(14, 5)
                }, 1000)
            }
        },

        setTimes(){
            console.log('orderTS :::',this.order)
            this.currentTime = Math.round(new Date().getTime()/1000)
            this.ordertime = this.currentTime 
            if(this.order.TS){
                this.ordertime =  Math.round(new Date(this.order.TS).getTime()/1000)
            }
            this.EndTime =  this.ordertime + 300
            this.countDown = this.EndTime - this.currentTime
        }
      },
        mounted(){
            this.setTimes()
            
            console.log('currentTime',this.currentTime)
            console.log('ordertime',this.ordertime)
            console.log('EndTime',this.EndTime)
            console.log('countDown',this.countDown)

            this.countDownTimer()
        }
      }

    
</script>


<style scoped>
h1{font-size: 40px !important;}

.status-card{
    position:fixed !important;
    bottom:0px;
    width:100%;
    z-index:999999999;
}

.staus.animation{
    width:100%
}

.va-modal__container{z-index: 9999999999 !important;}
</style>
<template>

    <div v-if="loading" class="flex lg6 xs12 py-4">
        <va-progress-circle indeterminate />
    </div>
    <div class="row">
        <div class="flex  xs12">
            <va-card >
                <va-card-content >
                    <h2> You have reached your coffee ordering limit for today, you can order a new coffee in: {{ `${timeRemaining}`}}</h2>
                        <img class="staus animation" style="width:100%;" src="https://assets.serverlesscoffee.com/images/45-clock-time-outline.gif">
                        <History v-bind:orderHistory="previousOrders" />
                </va-card-content>
            </va-card> 
        </div>
    </div>
</template>


<script>





import dayjs from 'dayjs'
import History from '@/components/History'


    export default {
      name: "Status",
      props:['historyConfig'],
       components: {
          History,
       },
      data(){
        return{  
            loading:true,
            countDown :0,
            percent: 0,
            timeRemaining:0,
            previousOrders: this.historyConfig
        }
      },

      async mounted(){

        console.log('banner',this.previousOrders)
  
        this.countDown = await this.setContDown();
        this.countDownTimer()
        
        this.loading=false
            
      },
        methods: {
            async setContDown(){
                const td= new Date()
                const today = dayjs(td)
                const tm = new Date(today)
                tm.setDate(tm.getDate() + 1)
                tm.setHours(0,0,0,0);
                const tomorrow = dayjs(tm)

               // console.log('tomorrow mignith:',tomorrow)
               // console.log('NOW',today)
               // console.log('time unti midnoight:',tomorrow.diff(today,'s'))
                return tomorrow.diff(today,'s')

            },

            countDownTimer() { 
                //console.log('count',this.countDown)
                if(this.countDown >0) {
                    setTimeout(() => {
                        this.countDown -= 1
                        this.countDownTimer()
                        this.timeRemaining = new Date(this.countDown * 1000).toISOString().substr(11, 8)
                    }, 1000)
                }
            },
        },
        async created(){
            
             
        }
        

        

    }
</script>


<style scoped>
h1{font-size: 40px !important;}
h2{font-size: 20px !important;}
table{  
  margin: auto !important;
  }


</style>


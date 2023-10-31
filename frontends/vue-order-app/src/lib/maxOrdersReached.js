'use strict'

const dayjs = require('dayjs')


// 
const isMaxOrdersReached= (list) => {

  console.log('LIST:::',list)

  let CustomerStatus = {}
  CustomerStatus.MaxOrdersReached = false

  if(list.result.length){
    
    let listres = list.result
    let list2 = listres.sort((a, b) => (a.TS > b.TS) ? 1 : -1)

    //get state 
      var d = new Date();
      d.setHours(0,0,0,0);
      let todaysMignight = dayjs(d).unix()
          let entry = list2.pop()
          const EntryTS = entry.TS/1000
          if (EntryTS > todaysMignight ){
                  //console.log('orderState',entry.ORDERSTATE)
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
}

module.exports = { isMaxOrdersReached }
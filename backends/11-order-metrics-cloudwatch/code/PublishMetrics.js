const AWS = require('aws-sdk')

const { CloudWatch } = require('@aws-sdk/client-cloudwatch');

const cloudWatch = new CloudWatch({
  region: process.env.AWS_REGION
})

exports.handler = async (event) => {
  console.log(JSON.stringify(event, null, 2))
  for (const record of event.Records) {
    const body = JSON.parse(record.body)
    const drink = body["detail"]["drinkOrder"]["drink"]  
    const params = {
        MetricData: [
        ],
        Namespace: `Serverlesspresso`
      }
    
      // Add drink info
      params.MetricData.push({
        'MetricName': 'Drink',
        'Dimensions': [
          {
            'Name': 'Drink',
            'Value': drink
          }
        ],
        'Unit': 'Count',
        'Value': 1
      })

      // Add drink info
      params.MetricData.push({
        'MetricName': 'Drink',
        'Dimensions': [
          {
            'Name': 'Drink',
            'Value': "Total Orders"
          }
        ],
        'Unit': 'Count',
        'Value': 1
      })
    console.log(await cloudWatch.putMetricData(params))
  }
}
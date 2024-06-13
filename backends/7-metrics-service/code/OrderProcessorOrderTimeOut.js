/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

const { CloudWatch } = require('@aws-sdk/client-cloudwatch');

const cloudWatch = new CloudWatch({
  region: process.env.AWS_REGION
})

exports.handler = async (event) => {
  console.log(JSON.stringify(event, null, 2))

  const params = {
    MetricData: [
      {
        'MetricName': 'Order',
        'Dimensions': [
          {
            'Name': 'State',
            'Value': 'Timeout'
          }
        ],
        Timestamp: event.time,
        'Unit': 'Count',
        'Value': 1
      }
    ],
    Namespace: `${process.env.AppName}-dev`
  }
  // Send to CloudWatch
  console.log(await cloudWatch.putMetricData(params))
}

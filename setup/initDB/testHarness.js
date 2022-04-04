/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

// Mock environment variables
process.env.AWS_REGION = 'us-east-2'
process.env.DDBtable = 'serverlesspresso-config-table'

// Lambda handler
const { initMenu } = require('./initMenu')
const main = async () => {
  console.time('localTest')
await initMenu()
  console.timeEnd('localTest')
}
main().catch(error => console.error(error))
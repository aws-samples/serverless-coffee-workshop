/**
 * This script will go through all the core template, create a cfn file and deploy assets to Eventengine.
 *
 * To run locally:
 *  - You need SAM installed
 *  - You need AWS creds with the ability to upload to S3 bucket.
 */

 const fs = require("fs");
 const path = require("path");
 const chalk = require('chalk');
 const { execSync } = require("child_process");



 const samBuild = () => {
  execSync(
   `sam build -t setup/template.yaml --profile da-admin`,
   {
      stdio: "inherit",
    }
  );
};


 const samPackage = () => {
   execSync(
    `sam package --region us-east-1 -t .aws-sam/build/template.yaml --output-template-file ./setup/tmp/cloudformation.yml --s3-bucket da-public-assets --s3-prefix workshops/coffee-workshop --profile da-admin`,
    {
       stdio: "inherit",
     }
   );
 };

 const copyDown = (asset) => {
 
  execSync(

   `aws s3 cp s3://da-public-assets/workshops/coffee-workshop/ ./setup/tmp --recursive --profile da-admin`,
    {
      stdio: "inherit",
    }
  );
};

const replaceUris = () => {
  fs.readFile('./setup/tmp/cloudformation.yml', 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    var result = data.replace(/s3:\/\/da-public-assets\/workshops\/coffee-workshop\//g, 's3://ee-assets-prod-us-east-1/modules/67b03f2bcecc4fafb15053897585b61f/v1/coffee-workshop/');
    var result2 = result.replace(/da-public-assets/g, 'ee-assets-prod-us-east-1');
    var result3 = result2.replace(/workshops\/coffee-workshop\//g, 'modules/67b03f2bcecc4fafb15053897585b61f/v1/coffee-workshop/');

    fs.writeFile('./setup/tmp/cloudformation.yml', result3, 'utf8', function (err) {
       if (err) return console.log(err);
    });
  });

};


const copyUptoEE = (asset) => {
 
  execSync(

   `aws s3 cp  ./setup/tmp s3://ee-assets-prod-us-east-1/modules/67b03f2bcecc4fafb15053897585b61f/v1/coffee-workshop/ --recursive --profile tmp-ee`,
    {
      stdio: "inherit",
    }
  );
};

 const processWorkshop = async () => { 
   // Sam package to generate resources and cloudformation data
   samBuild();
   samPackage();
   copyDown()
   replaceUris()
   copyUptoEE()
 };

 const main = async () => {
 
     try {
       console.log(chalk.green(`Processing Workshop template.yaml`))
       await processWorkshop();
       console.log(chalk.green(`DONE ! copy the cfn.yml template into Event Engine module config`))


     } catch (error) {
       console.log(error)
       console.log(chalk.red(`Failed to process pattern: template.yaml, skipping...`))
       console.log(chalk.red(`Dont forget to update tmp-ee credentials, they expire quickly!`))
     }
    
 };
 
 main();
 
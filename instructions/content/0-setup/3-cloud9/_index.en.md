+++
title = "AWS Cloud9 IDE"
weight = 13
+++

{{% notice info%}}
After completed either of 2 previous sections ([AWS hosted](/0-setup/1-aws-hosted.html) or [self hosted](/0-setup/1-awselfs-hosted.html)) an [AWS Cloud9](https://aws.amazon.com/cloud9/) instance is been created for you.
 {{% /notice %}}

Cloud9 is a cloud-based integrated development environment (IDE) that lets you write, run, and debug your code with just a browser. It includes a code editor, debugger, and terminal. Cloud9 comes pre-packaged with essential tools for popular programming languages and the AWS Command Line Interface (CLI) pre-installed so you don’t need to install files or configure your laptop for this workshop.

Your Cloud9 environment will have access to the same AWS resources as the user with which you logged into the AWS Management Console. We strongly recommend using Cloud9 to complete this workshop.

## Starting AWS Cloud9 ##


1. Go to the AWS Management Console, Select **Services** then select [**Cloud9**](https://us-east-1.console.aws.amazon.com/cloud9/home) under Developer Tools. From the top-right of the Console, select the  region for this workshop.  Use the same region for the entirety of this workshop.

7. From the Cloud9 Navigtion, select *Your environments*, then choose *Open IDE* from the newly created Cloud9 instace named *Serverlesspresso-development*.

![Cloud9](../images/se-mod0-cloud9-env.png)


7. This opens up at the Cloud9 IDE welcome screen. Below that, you should see a terminal prompt. Close the *Welcome* tab and drag up the terminal window to give yourself more space to work in.

![Cloud9](../images/setup5.png)

You can run AWS CLI commands here just like you would on your local computer. Remember for this workshop to run all commands within the Cloud9 terminal window instead of your local computer.

Keep your AWS Cloud9 IDE opened in a browser tab throughout this workshop.

8. Verify that your user is logged in by running the command `aws sts get-caller-identity`. Copy and paste the command into the Cloud9 terminal window.

```console
aws sts get-caller-identity
```

You'll see output indicating your account and user information:

```json
{
    "Account": "123456789012",
    "UserId": "AKIAI44QH8DHBEXAMPLE",
    "Arn": "arn:aws:iam::123456789012:user/Roxie"
}
```
9. Check the current AWS Region to make sure you are running the workshop in a supported Region. Run these commands in the Cloud9 terminal window:
```bash
AWS_REGION=$(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone | sed 's/\(.*\)[a-z]/\1/')
SUPPORTED_REGIONS=("us-west-2" "us-east-1" "us-east-2" "eu-central-1" "eu-west-1" "ap-southeast-2" "sa-east-1" "ap-northeast-1")

if [[ ! " ${SUPPORTED_REGIONS[@]} " =~ " ${AWS_REGION} " ]]; then
    /bin/echo -e "\e[1;31m'$AWS_REGION' is not a supported AWS Region, delete this Cloud9 instance and restart the workshop in a supported AWS Region.\e[0m"
else
    /bin/echo -e "\e[1;32m'$AWS_REGION' is a supported AWS Region\e[0m"
fi
```
Make sure the response confirms your Region is supported.

![Module 0 Region check](../images/0-setup-region-check.png)

{{% notice tip %}}

Keep an open scratch pad in Cloud9 or a text editor on your local computer for notes. When the step-by-step directions tell you to note something such as
an ID or Amazon Resource Name (ARN), copy and paste that into your scratch pad.

{{% /notice %}}

### Recap

- Use the same region you selected when deploying AWS Cloud9 IDE for the entirety of this workshop.

- Keep your AWS Cloud9 IDE opened in a tab.

### Next steps

In the next module, you'll start building the initial application.

[region-table]: https://aws.amazon.com/about-aws/global-infrastructure/regional-product-services/
[static-web-hosting]: ../1-frontend/
[1-app-deploy]: ../1-app-deploy/

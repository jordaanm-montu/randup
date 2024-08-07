#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { IacStack } from "../lib/iac-stack";

const app = new cdk.App();
new IacStack(app, "RandupIacStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    // region: process.env.CDK_DEFAULT_REGION,
    region: "ap-southeast-2",
  },
});

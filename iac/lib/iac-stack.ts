import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";
import { Construct } from "constructs";

const DOMAIN_NAME = "randup.util.staging.montu.com.au";
const ZONE_DOMAIN = "staging.montu.com.au";

export class IacStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //Step 1: Get S3 Bucket

    const staticWebsiteBucket = new s3.Bucket(this, `bucket-${id}`, {
      websiteIndexDocument: "index.html",
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      bucketName: `randup-static-site-${id}`.toLowerCase(),
    });

    const hostedZone = route53.HostedZone.fromLookup(this, `HostedZone`, {
      domainName: ZONE_DOMAIN,
    });

    const httpsCertificate = new acm.Certificate(this, `cert-${id}`, {
      domainName: DOMAIN_NAME,
      validation: acm.CertificateValidation.fromDns(hostedZone),
      certificateName: `Certificate-${id}`,
    });

    const oac = new cloudfront.CfnOriginAccessControl(this, `oac-${id}`, {
      originAccessControlConfig: {
        name: `RandupCfnOriginAccessControl`,
        originAccessControlOriginType: "s3",
        signingBehavior: "always",
        signingProtocol: "sigv4",
      },
    });

    //Step 2: Get Cloudfront Distribution

    const cloudFrontDistribution = new cloudfront.CloudFrontWebDistribution(
      this,
      `dist-${id}`,
      {
        defaultRootObject: "index.html",
        viewerCertificate: cloudfront.ViewerCertificate.fromAcmCertificate(
          httpsCertificate,
          {
            aliases: [DOMAIN_NAME],
          }
        ),
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: staticWebsiteBucket,
            },
            behaviors: [
              {
                isDefaultBehavior: true,
                viewerProtocolPolicy:
                  cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
              },
            ],
          },
        ],
        errorConfigurations: [
          {
            errorCode: 403,
            responsePagePath: "/index.html",
            responseCode: 200,
            errorCachingMinTtl: 60,
          },
        ],
      }
    );

    const cfnDistribution = cloudFrontDistribution.node
      .defaultChild as cloudfront.CfnDistribution;
    cfnDistribution.addPropertyOverride(
      "DistributionConfig.Origins.0.OriginAccessControlId",
      oac.getAtt("Id")
    );

    staticWebsiteBucket.addToResourcePolicy(
      new cdk.aws_iam.PolicyStatement({
        effect: cdk.aws_iam.Effect.ALLOW,
        principals: [
          new cdk.aws_iam.ServicePrincipal("cloudfront.amazonaws.com"),
        ],
        actions: ["s3:GetObject"],
        resources: [`${staticWebsiteBucket.bucketArn}/*`],
        conditions: {
          StringEquals: {
            "AWS:SourceArn": `arn:aws:cloudfront::${cdk.Aws.ACCOUNT_ID}:distribution/${cloudFrontDistribution.distributionId}`,
          },
        },
      })
    );

    //Step 3: Deploy to bucket
    new s3deploy.BucketDeployment(this, `bucketDeploy-${id}`, {
      sources: [s3deploy.Source.asset("../dist")],
      destinationBucket: staticWebsiteBucket,
      distributionPaths: ["/*"],
      distribution: cloudFrontDistribution,
    });

    //Step 3: setup Route53 alias
    new route53.ARecord(this, `aRecord-${id}`, {
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(
        new CloudFrontTarget(cloudFrontDistribution)
      ),
      recordName: DOMAIN_NAME,
    });
  }
}

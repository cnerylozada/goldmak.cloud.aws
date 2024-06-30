import type { AWS } from "@serverless/typescript";

import { uploadFile } from "@functions/manageFiles";

const serverlessConfiguration: AWS = {
  service: "goldmak-cloud-aws",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs18.x",
    stage: "${opt:stage, 'dev'}",
    region: "us-east-2",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      goldmakS3BucketArn: "${cf:goldmak-iac-aws-dev.goldmakS3BucketArn}",
      goldmakS3BucketName: "${cf:goldmak-iac-aws-dev.goldmakS3BucketName}",
      providerRegion: "${self:provider.region}",
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Resource: ["${self:provider.environment.goldmakS3BucketArn}/*"],
            Action: ["s3:PutObject", "s3:GetObject"],
          },
        ],
      },
    },
  },
  resources: {
    Resources: {
      goldmakManageFilesApiKey: {
        Type: "AWS::ApiGateway::ApiKey",
        Properties: {
          Name: "goldmakManageFilesApiKey",
          Enabled: true,
          Value: "e132923a-77d8-4216-8edd-4c0d87c1fed0",
        },
      },
      goldmakManageFilesUsePlan: {
        Type: "AWS::ApiGateway::UsagePlan",
        Properties: {
          UsagePlanName: "goldmakManageFilesUsePlan",
          Quota: {
            Limit: 5000,
            Period: "MONTH",
          },
          Throttle: {
            BurstLimit: 200,
            RateLimit: 100,
          },
          ApiStages: [
            {
              ApiId: {
                Ref: "ApiGatewayRestApi",
              },
              Stage: "${self:provider.stage}",
            },
          ],
        },
      },
      goldmakManageFilesUsePlanKey: {
        Type: "AWS::ApiGateway::UsagePlanKey",
        Properties: {
          KeyId: {
            Ref: "goldmakManageFilesApiKey",
          },
          KeyType: "API_KEY",
          UsagePlanId: {
            Ref: "goldmakManageFilesUsePlan",
          },
        },
      },
    },
  },
  // import the function via paths
  functions: { uploadFile },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;

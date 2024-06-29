import type { AWS } from "@serverless/typescript";

import { uploadFiles } from "@functions/manageFiles";

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
  // import the function via paths
  functions: { uploadFiles },
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

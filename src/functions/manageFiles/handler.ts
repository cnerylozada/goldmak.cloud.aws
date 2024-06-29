import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"; // ES Modules import
const client = new S3Client();

export const uploadFiles: Handler = async (event: APIGatewayProxyEvent) => {
  const { fileContent } = JSON.parse(event.body);

  const fileNameWithExtension = "Cristian Lozada.png";
  const extensionIndex = fileNameWithExtension.lastIndexOf(".");
  const extension = fileNameWithExtension.slice(extensionIndex + 1);
  const fileName = `avatar_${Date.now()}`;
  const key = `myImages/${fileName}.${extension}`;

  const xxx = new Buffer(fileContent, "base64");
  const input = {
    Body: xxx,
    Bucket: process.env.goldmakS3BucketArn,
    Key: key,
  };
  const command = new PutObjectCommand(input);
  const response = await client.send(command);

  return {
    body: JSON.stringify({
      response: response,
    }),
  };
};

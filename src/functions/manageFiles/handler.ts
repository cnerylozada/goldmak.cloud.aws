import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"; // ES Modules import
const client = new S3Client();

export const uploadFiles: Handler = async (event: APIGatewayProxyEvent) => {
  const { fileContentInBase64, fileNameWithExtension } = JSON.parse(event.body);

  const extensionIndex = fileNameWithExtension.lastIndexOf(".");
  const extension = fileNameWithExtension.slice(extensionIndex + 1);
  const fileName = `product-${Date.now()}`;
  const key = `orgs/1/products/${fileName}.${extension}`;

  const contentAsBuffer = new Buffer(fileContentInBase64, "base64");
  const input = {
    Body: contentAsBuffer,
    Bucket: process.env.goldmakS3BucketName,
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

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"; // ES Modules import
import { IFileToUpload } from "src/models/models";

const client = new S3Client();

export class ManageFiles {
  static async uploadFile(fileToUpload: IFileToUpload) {
    const { fileNameWithExtension, fileContentInBase64 } = fileToUpload;

    const bucketName = process.env.goldmakS3BucketName;
    const extensionIndex = fileNameWithExtension.lastIndexOf(".");
    const extension = fileNameWithExtension.slice(extensionIndex + 1);
    const fileName = `product-${Date.now()}`;
    const key = `orgs/1/products/${fileName}.${extension}`;

    const contentAsBuffer = new Buffer(fileContentInBase64, "base64");
    const input = {
      Body: contentAsBuffer,
      Bucket: bucketName,
      Key: key,
    };
    const command = new PutObjectCommand(input);
    const response = await client.send(command);
    return {
      ...response,
      objectURL: `https://s3.${process.env.providerRegion}.amazonaws.com/${bucketName}/${key}`,
    };
  }
}

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"; // ES Modules import
import { IFileToUpload, IResource } from "src/models/models";

const client = new S3Client();

export class ManageFiles {
  static async uploadFile(resource: IResource, fileToUpload: IFileToUpload) {
    const { fileNameWithExtension, fileContentInBase64 } = fileToUpload;

    const bucketName = process.env.goldmakS3BucketName;
    const extensionIndex = fileNameWithExtension.lastIndexOf(".");
    const extension = fileNameWithExtension.slice(extensionIndex + 1);

    const fileNameByType =
      resource.resourceType === "organization"
        ? `org-${Date.now()}`
        : `product-${Date.now()}`;

    const baseFileKey = `orgs/${resource.organizationId}`;
    const keyByResourceType =
      resource.resourceType === "organization"
        ? `${baseFileKey}/${fileNameByType}.${extension}`
        : `${baseFileKey}/products/${fileNameByType}.${extension}`;

    const contentAsBuffer = new Buffer(fileContentInBase64, "base64");
    const input = {
      Body: contentAsBuffer,
      Bucket: bucketName,
      Key: keyByResourceType,
    };
    const command = new PutObjectCommand(input);
    const response = await client.send(command);

    return {
      objectURL: `https://s3.${process.env.providerRegion}.amazonaws.com/${bucketName}/${keyByResourceType}`,
    };
  }
}

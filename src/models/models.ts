type resourceType = "organization" | "product";

export interface IFileToUpload {
  fileContentInBase64: string;
  fileNameWithExtension: string;
}

export interface IResource {
  resourceType: resourceType;
  organizationId: string;
}

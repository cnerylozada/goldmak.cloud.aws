import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { ManageFiles } from "src/services/ManageFiles";

export const uploadFile: Handler = async (event: APIGatewayProxyEvent) => {
  const {
    resourceType,
    organizationId,
    fileContentInBase64,
    fileNameWithExtension,
  } = JSON.parse(event.body);

  const response = await ManageFiles.uploadFile(
    { organizationId, resourceType },
    {
      fileContentInBase64,
      fileNameWithExtension,
    }
  );

  return {
    body: JSON.stringify({
      response: response,
    }),
  };
};

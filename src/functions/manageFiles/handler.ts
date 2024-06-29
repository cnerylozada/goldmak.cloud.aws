import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { ManageFiles } from "src/services/ManageFiles";

export const uploadFiles: Handler = async (event: APIGatewayProxyEvent) => {
  const { fileContentInBase64, fileNameWithExtension } = JSON.parse(event.body);

  const response = await ManageFiles.uploadFile({
    fileContentInBase64,
    fileNameWithExtension,
  });

  return {
    body: JSON.stringify({
      response: response,
    }),
  };
};

import { handlerPath } from "@libs/handler-resolver";

export const uploadFile = {
  handler: `${handlerPath(__dirname)}/handler.uploadFile`,
  events: [
    {
      http: {
        method: "post",
        path: "resources/upload-file",
      },
    },
  ],
};

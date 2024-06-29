import { handlerPath } from "@libs/handler-resolver";

export const uploadFiles = {
  handler: `${handlerPath(__dirname)}/handler.uploadFiles`,
  events: [
    {
      http: {
        method: "post",
        path: "hello",
      },
    },
  ],
};

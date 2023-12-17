import { KinesisHandler, MiddlewareFunction } from "../lambda/types";

export const withPayloadValidation: MiddlewareFunction<KinesisHandler> = (handler) => {
  return async (event, context) => {
    if (!context.tenantId || !context.sessionId) {
      throw new Error('Missing tenant id or session id');
    }

    // validate payload schema here 

    return await handler(event, context);
  };
}

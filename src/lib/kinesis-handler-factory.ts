import { Callback, KinesisStreamBatchResponse, KinesisStreamEvent } from "aws-lambda";
import { ExtendedContext, MiddlewareFunction } from "../types/handler-factory";

const withPayloadValidation: MiddlewareFunction<KinesisHandler> = (handler: KinesisHandler) => {
  return async (event: KinesisStreamEvent, context: ExtendedContext, callback: Callback<void | Promise<KinesisStreamBatchResponse>>) => {
    if (!context.tenantId || !context.sessionId) {
      throw new Error('Missing tenant id or session id');
    }

    // validate payload schema here 

    return await handler(event, context, callback);
  };
}

export type KinesisHandler = (event: KinesisStreamEvent, context: ExtendedContext, callback: Callback<any>) => Promise<void | KinesisStreamBatchResponse>;

export function KinesisHandlerFactory(handler: KinesisHandler, middlewares: MiddlewareFunction<KinesisHandler>[]): KinesisHandler {
  const defaultMiddlewares = [withPayloadValidation];

  return defaultMiddlewares.reduce((currentHandler, middleware) => middleware(currentHandler), handler);
}


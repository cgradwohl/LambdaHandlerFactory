import { APIGatewayHandler, KinesisHandler, MiddlewareFunction } from "./types";

export const withAuthorization: MiddlewareFunction<APIGatewayHandler> = (handler) => {
  return async (event, context) => {
    if (typeof event.headers['x-tenant-id'] !== 'string') {
      throw new Error('Missing tenant id');
    }

    if (typeof event.headers['x-session-id'] !== 'string') {
      throw new Error('Missing session id');
    }

    const tenantId = event.headers['x-tenant-id'];
    const sessionId = event.headers['x-session-id'];

    return await handler(event, { ...context, tenantId, sessionId });
  };
}



export const withPayloadValidation: MiddlewareFunction<KinesisHandler> = (handler) => {
  return async (event, context) => {
    if (!context.tenantId || !context.sessionId) {
      throw new Error('Missing tenant id or session id');
    }

    // validate payload schema here 

    return await handler(event, context);
  };
}


export function createAPIGatewayWorker(handler: APIGatewayHandler, middlewares: MiddlewareFunction<APIGatewayHandler>[] = []): APIGatewayHandler {
  const defaultMiddlewares = [withAuthorization];
  return defaultMiddlewares.concat(middlewares).reduce((currentHandler, middleware) => middleware(currentHandler), handler);
}

export function createKinesisWorker(handler: KinesisHandler, middlewares: MiddlewareFunction<KinesisHandler>[] = []): KinesisHandler {
  const defaultMiddlewares = [withPayloadValidation];
  return defaultMiddlewares.concat(middlewares).reduce((currentHandler, middleware) => middleware(currentHandler), handler);
}

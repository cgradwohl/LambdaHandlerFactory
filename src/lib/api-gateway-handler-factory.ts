import { APIGatewayEvent, APIGatewayProxyResult, Callback, APIGatewayProxyEvent } from 'aws-lambda';
import { ExtendedContext, MiddlewareFunction } from '../types/handler-factory';

const withAuthorization: MiddlewareFunction<APIGatewayHandler> = (handler) => {
  return async (event: APIGatewayEvent, context: ExtendedContext) => {
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

export type APIGatewayHandler = (event: APIGatewayProxyEvent, context: ExtendedContext) => Promise<void | APIGatewayProxyResult>;

export function APIGatewayHandlerFactory(handler: APIGatewayHandler, middlewares: MiddlewareFunction<APIGatewayHandler>[]): APIGatewayHandler {
  const defaultMiddlewares = [withAuthorization];

  return defaultMiddlewares.reduce((currentHandler, middleware) => middleware(currentHandler), handler);
}

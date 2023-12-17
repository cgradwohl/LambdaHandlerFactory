import { APIGatewayHandler, MiddlewareFunction } from "../lambda/types";

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


import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

// Middlewares
type MiddlewareFunction<T> = (handler: T) => T;
const errorHandling: MiddlewareFunction<APIGatewayHandler> = (handler) => {
  return async (event, context) => {
    try {
      return await handler(event, context);
    } catch (error) {
      // TODO: return correct error responses
      console.error(error);

      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Internal Server Error'
        })
      };
    }
  };
}

const authorization: MiddlewareFunction<APIGatewayHandler> = (handler) => {
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

interface ExtendedContext extends Context {
  tenantId: string;
  sessionId: string;
}

type APIGatewayHandler = (event: APIGatewayProxyEvent, context: ExtendedContext) => Promise<void | APIGatewayProxyResult>;

class APIGatewayWorker {
  // default middlewares
  private middlewares: MiddlewareFunction<APIGatewayHandler>[] = [];

  constructor(private handler: APIGatewayHandler) { }

  with(middleware: MiddlewareFunction<APIGatewayHandler>): APIGatewayWorker {
    this.middlewares.push(middleware);
    return this;
  }

  build(): APIGatewayHandler {
    return this.middlewares.reduce(
      (currentHandler, middleware) => middleware(currentHandler),
      this.handler
    );
  }
}

// Usage
const eventHandler: APIGatewayHandler = async (event, context) => {
  console.log('event', event);
  console.log('context', context);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello World!' })
  };
};

export const handler = new APIGatewayWorker(eventHandler)
  .with(authorization)
  .with(errorHandling)
  .build();

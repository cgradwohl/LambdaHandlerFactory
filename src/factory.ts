import { APIGatewayProxyHandler, KinesisStreamHandler, Context, APIGatewayEvent, APIGatewayProxyResult, Callback } from 'aws-lambda';

interface ExtendedContext extends Context {
  tenantId: string;
  sessionId: string;
}

type ExtendedAPIGatewayProxyHandler = (event: APIGatewayEvent, context: ExtendedContext, callback: Callback<APIGatewayProxyResult>) => void | Promise<APIGatewayProxyResult>;
type ExtendedKinesisStreamHandler = (event: any, context: ExtendedContext, callback: Callback<any>) => void | Promise<any>;

type MiddlewareFunction<T extends ExtendedAPIGatewayProxyHandler | ExtendedKinesisStreamHandler> = (handler: T) => T;

function withErrorHandling<T extends ExtendedAPIGatewayProxyHandler | ExtendedKinesisStreamHandler>(handler: T): T {
  return (async (event: any, context: ExtendedContext, callback: Callback<APIGatewayProxyResult> & Callback<any>) => {
    try {
      return await handler(event, context, callback);
    } catch (error) {
      console.error("Error in handler:", error);
      throw error; // Or handle the error as per your logic
    }
  }) as T;
}

function withTenantResolution<T extends ExtendedAPIGatewayProxyHandler | ExtendedKinesisStreamHandler>(handler: T): T {
  return (async (event: { headers: { [x: string]: any; }; }, context: any, callback: Callback<APIGatewayProxyResult> & Callback<any>) => {
    if (!event.headers || !event.headers['X-Tenant-ID']) {
      throw new Error("Missing Tenant ID");
    }
    const extendedContext = { ...context, tenantId: event.headers['X-Tenant-ID'] };
    return handler(event, extendedContext as ExtendedContext, callback);
  }) as T;
}

function withAuthorization<T extends ExtendedAPIGatewayProxyHandler | ExtendedKinesisStreamHandler>(handler: T): T {
  return (async (event: { headers: { [x: string]: any; }; }, context: any, callback: Callback<APIGatewayProxyResult> & Callback<any>) => {
    if (!event.headers || !event.headers['Authorization']) {
      throw new Error("Missing Authorization");
    }
    const extendedContext = { ...context, sessionId: 'extracted-session-id' }; // Extract sessionId as needed
    return handler(event, extendedContext as ExtendedContext, callback);
  }) as T;
}

function HandlerFactory<T extends ExtendedAPIGatewayProxyHandler | ExtendedKinesisStreamHandler>(handler: T, middlewares: MiddlewareFunction<T>[] = []): T {
  return middlewares.reduce((currentHandler, middleware) => middleware(currentHandler), handler);
}

// Usage example
const myHandler: ExtendedAPIGatewayProxyHandler = async (event, context) => {
  // Your handler logic here
  return {
    statusCode: 200,
    body: JSON.stringify({ tenantId: context.tenantId, sessionId: context.sessionId })
  };
};

export const handler = HandlerFactory<ExtendedAPIGatewayProxyHandler>(myHandler, [withErrorHandling, withTenantResolution, withAuthorization]);

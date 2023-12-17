import { APIGatewayProxyHandler, KinesisStreamHandler, Context, APIGatewayEvent, APIGatewayProxyResult, Callback, KinesisStreamEvent, KinesisStreamBatchResponse, APIGatewayProxyEvent } from 'aws-lambda';

interface ExtendedContext extends Context {
  tenantId: string;
  sessionId: string;
}

type APIGatewayHandler = (event: APIGatewayProxyEvent, context: ExtendedContext, callback: Callback<APIGatewayProxyResult>) => void | Promise<APIGatewayProxyResult>;

type KinesisHandler = (event: KinesisStreamEvent, context: ExtendedContext, callback: Callback<any>) => void | Promise<KinesisStreamBatchResponse>;

type MiddlewareFunction = (handler: APIGatewayProxyHandler | KinesisStreamHandler) => APIGatewayHandler | KinesisHandler;

// function withErrorHandling<T extends ExtendedAPIGatewayProxyHandler | ExtendedKinesisStreamHandler>(handler: T): T {
//   return (async (event: any, context: ExtendedContext, callback: Callback<APIGatewayProxyResult> & Callback<any>) => {
//     try {
//       return await handler(event, context, callback);
//     } catch (error) {
//       console.error("Error in handler:", error);
//       throw error; // Or handle the error as per your logic
//     }
//   }) as T;
// }

// function withTenantResolution<T extends ExtendedAPIGatewayProxyHandler | ExtendedKinesisStreamHandler>(handler: T): T {
//   return (async (event: { headers: { [x: string]: any; }; }, context: any, callback: Callback<APIGatewayProxyResult> & Callback<any>) => {
//     if (!event.headers || !event.headers['X-Tenant-ID']) {
//       throw new Error("Missing Tenant ID");
//     }
//     const extendedContext = { ...context, tenantId: event.headers['X-Tenant-ID'] };
//     return handler(event, extendedContext as ExtendedContext, callback);
//   }) as T;
// }

// function withAuthorization<T extends ExtendedAPIGatewayProxyHandler | ExtendedKinesisStreamHandler>(handler: T): T {
//   return (async (event: { headers: { [x: string]: any; }; }, context: any, callback: Callback<APIGatewayProxyResult> & Callback<any>) => {
//     if (!event.headers || !event.headers['Authorization']) {
//       throw new Error("Missing Authorization");
//     }
//     const extendedContext = { ...context, sessionId: 'extracted-session-id' }; // Extract sessionId as needed
//     return handler(event, extendedContext as ExtendedContext, callback);
//   }) as T;
// }

// function HandlerFactory<T extends ExtendedAPIGatewayProxyHandler | ExtendedKinesisStreamHandler>(handler: T, middlewares: MiddlewareFunction<T>[] = []): T {
//   return middlewares.reduce((currentHandler, middleware) => middleware(currentHandler), handler);
// }

// function APIGatewayProxyHandlerFactory(handler: ExtendedAPIGatewayProxyHandler, middlewares: MiddlewareFunction<ExtendedAPIGatewayProxyHandler>[] = []): ExtendedAPIGatewayProxyHandler {
//   const defaultMiddlewares = [withTenantResolution, withAuthorization,];

//   return HandlerFactory(handler, [...middlewares, ...defaultMiddlewares]);
// }

// function KinesisStreamHandlerFactory(handler: ExtendedKinesisStreamHandler, middlewares: MiddlewareFunction<ExtendedKinesisStreamHandler>[] = []): ExtendedKinesisStreamHandler {
//   const defaultMiddlewares = [withTenantResolution, withAuthorization,];

//   return HandlerFactory(handler, [...middlewares, ...defaultMiddlewares]);
// }
// // -  - - - - - - 
// // worker.ts
// // -  - - - - - - 
// const myHttpHandler: ExtendedAPIGatewayProxyHandler = async (event, context) => {
//   // Your handler logic here
//   return {
//     statusCode: 200,
//     body: JSON.stringify({ tenantId: context.tenantId, sessionId: context.sessionId })
//   };
// };

// // worker.ts
// export const handler = APIGatewayProxyHandlerFactory(myHttpHandler, [withErrorHandling]);


// const myKinesisHandler: ExtendedKinesisStreamHandler = async (event, context) => {
//   return {};
// }

// // worker.ts
// export const handler = KinesisStreamHandlerFactory(myKinesisHandler, [withErrorHandling]);

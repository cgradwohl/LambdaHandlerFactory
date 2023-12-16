import { Handler } from "aws-lambda";

// -  - - - - - - - - - - - - - 
// handler-factory.ts
// -  - - - - - - - - - - - - - 
interface HandlerContext {
  tenantId: string;
  sessionId: string;
}

interface HTTPHandlerResponse {
  statusCode: number;
  body: string;
}

type HTTPHandler = (event: any, context: HandlerContext) => Promise<HTTPHandlerResponse>;
type KinesisHandler = (event: any, context: HandlerContext) => Promise<any>;
type S3Handler = (event: any, context: HandlerContext) => Promise<any>;

type HandlerFunctionWithContext = HTTPHandler | KinesisHandler | S3Handler;
type MiddlewareFunction<T extends HandlerFunctionWithContext> = (handler: T) => T;

export function AuthorizationMiddleware<T extends HandlerFunctionWithContext>(handler: T): T {
  function validateApiKey(apiKey: string): string {
    if (!apiKey) {
      throw new Error("Missing apiKey");
    }

    return "sessionId";
  }

  return (async (event: any, context: any) => {
    const apiKey = event.headers["x-api-key"];
    validateApiKey(apiKey);
    return handler(event, context);
  }) as T;
}

export function ResolveTenantMiddleware<T extends HandlerFunctionWithContext>(handler: T): T {
  function getTenantIdByApiKey(apiKey: string) {
    return "tenantId";
  }

  return (async (event: any, context: any) => {
    const apiKey = event.headers["x-api-key"];

    const tenantId = getTenantIdByApiKey(apiKey);

    const serviceContext = { ...context, tenantId };

    return await handler(event, serviceContext);
  }) as T;
}

export const DefaultMiddleware: MiddlewareFunction<any>[] = [
  AuthorizationMiddleware,
  ResolveTenantMiddleware
];



// This is unique to each Lambda Trigger 
export function HandlerFactory<T extends HandlerFunctionWithContext>(handler: T) {


  const use = (...newMiddlewares: MiddlewareFunction<any>[]) => {
    DefaultMiddleware.push(...newMiddlewares);

    const handlerWithMiddleware = DefaultMiddleware.reduceRight(
      (currentHandler, nextMiddleware) => nextMiddleware(currentHandler),
      handler
    );

    return async (event: any, context: HandlerContext) => {
      return handlerWithMiddleware(event, context);
    };
  };

  return { use };
};

// -  - - - - - - - - - - - - - 
// worker.ts
// -  - - - - - - - - - - - - - 
function withErrorHandling(handler: HTTPHandler): HTTPHandler {
  return async (event: any, context: any): Promise<HTTPHandlerResponse> => {
    try {
      return await handler(event, context);
    } catch (error: any) {
      console.error(error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message || "Internal Server Error" })
      };
    }
  };
};

async function handleRecord(event: any, context: HandlerContext): Promise<HTTPHandlerResponse> {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: `Hello from tenant ${context.tenantId}` })
  };
}


export const handler = HandlerFactory<HTTPHandler>(handleRecord).use(withErrorHandling);

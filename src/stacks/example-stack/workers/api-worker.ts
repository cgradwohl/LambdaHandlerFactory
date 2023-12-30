import { createAPIGatewayWorker, createWorkerWithMiddlewares } from "../../../lib/workers";
import { APIGatewayHandler, MiddlewareFunction } from "../../../lib/workers/types";

const handleEvent: APIGatewayHandler = async (event, context) => {
  console.log('event', event);
  console.log('context', context);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello World!'
    })
  };
}

const withErrorHandling: MiddlewareFunction<APIGatewayHandler> = (handler) => {
  return async (event, context) => {
    try {
      return await handler(event, context);
    } catch (error) {
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

export const handler = createWorkerWithMiddlewares(handleEvent, [withErrorHandling]);

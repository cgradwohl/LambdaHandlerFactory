import { APIGatewayEvent, APIGatewayProxyResult, Callback } from "aws-lambda";
import { APIGatewayHandler, APIGatewayHandlerFactory } from "../lib/api-gateway-handler-factory";
import { ExtendedContext, MiddlewareFunction } from "../types/handler-factory";

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

const withErrorHandling: MiddlewareFunction = (handler: APIGatewayHandler) => {
  return async (event: APIGatewayEvent, context: ExtendedContext, callback: Callback<APIGatewayProxyResult>) => {
    try {
      return await handler(event, context, callback);
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

export const handler = APIGatewayHandlerFactory(handleEvent, [withErrorHandling]);

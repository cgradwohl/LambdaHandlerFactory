import { APIGatewayEvent, APIGatewayProxyResult, Callback } from "aws-lambda";
import { APIGatewayHandler, APIGatewayHandlerFactory } from "../lib/api-gateway-handler-factory";
import { ExtendedContext, MiddlewareFunction } from "../types/handler-factory";
import { KinesisHandler, KinesisHandlerFactory } from "../lib/kinesis-handler-factory";

const handleEvent: KinesisHandler = async (event, context) => {
  event.Records.forEach(record => {
    console.log('record', record);
  });
}

const withErrorHandling: MiddlewareFunction<KinesisHandler> = (handler) => {
  return async (event, context, callback) => {
    try {
      return await handler(event, context, callback);
    } catch (error) {
      console.error(error);
      throw error
    }
  };
}

export const handler = KinesisHandlerFactory(handleEvent, [withErrorHandling]);

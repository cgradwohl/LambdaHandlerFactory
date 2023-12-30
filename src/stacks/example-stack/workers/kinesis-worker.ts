import { createKinesisWorker } from "../../../lib/workers";
import { KinesisHandler, MiddlewareFunction } from "../../../lib/workers/types";

const handleEvent: KinesisHandler = async (event, context) => {
  event.Records.forEach(record => {
    console.log('record', record);
  });
}

const withErrorHandling: MiddlewareFunction<KinesisHandler> = (handler) => {
  return async (event, context) => {
    try {
      return await handler(event, context);
    } catch (error) {
      console.error(error);
      throw error
    }
  };
}

export const handler = createKinesisWorker(handleEvent, [withErrorHandling]);

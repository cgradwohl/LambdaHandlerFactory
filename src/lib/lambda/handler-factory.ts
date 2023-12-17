import { withAuthorization } from "../api-gateway/middlewares";
import { withPayloadValidation } from "../kinesis/middlewares";
import { APIGatewayHandler, KinesisHandler, MiddlewareFunction } from "./types";

export class LambdaHandlerFactory {
  static createAPIGatewayHandler(handler: APIGatewayHandler, middlewares: MiddlewareFunction<APIGatewayHandler>[] = []): APIGatewayHandler {
    const defaultMiddlewares = [withAuthorization];
    return defaultMiddlewares.concat(middlewares).reduce((currentHandler, middleware) => middleware(currentHandler), handler);
  }

  static createKinesisHandler(handler: KinesisHandler, middlewares: MiddlewareFunction<KinesisHandler>[] = []): KinesisHandler {
    const defaultMiddlewares = [withPayloadValidation];
    return defaultMiddlewares.concat(middlewares).reduce((currentHandler, middleware) => middleware(currentHandler), handler);
  }
}

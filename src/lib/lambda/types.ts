import { APIGatewayProxyEvent, APIGatewayProxyResult, Context, KinesisStreamBatchResponse, KinesisStreamEvent } from "aws-lambda";

export interface ExtendedContext extends Context {
  tenantId: string;
  sessionId: string;
}

export type APIGatewayHandler = (event: APIGatewayProxyEvent, context: ExtendedContext) => Promise<void | APIGatewayProxyResult>;

export type KinesisHandler = (event: KinesisStreamEvent, context: ExtendedContext) => Promise<void | KinesisStreamBatchResponse>;

export type MiddlewareFunction<T> = (handler: T) => T;

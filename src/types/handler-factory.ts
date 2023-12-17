import { Context } from "aws-lambda";

export interface ExtendedContext extends Context {
  tenantId: string;
  sessionId: string;
}

export type MiddlewareFunction<T> = (handler: T) => T;

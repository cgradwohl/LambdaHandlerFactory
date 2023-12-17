import { Context } from "aws-lambda";

export interface ExtendedContext extends Context {
  tenantId: string;
  sessionId: string;
}

export type MiddlewareFunction = (handler: any) => any;

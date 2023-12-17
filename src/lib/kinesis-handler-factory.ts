import { Callback, KinesisStreamBatchResponse, KinesisStreamEvent } from "aws-lambda";
import { ExtendedContext } from "../types/handler-factory";

type KinesisHandler = (event: KinesisStreamEvent, context: ExtendedContext, callback: Callback<any>) => void | Promise<KinesisStreamBatchResponse>;

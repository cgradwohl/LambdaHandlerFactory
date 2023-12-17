## Projects
1. api gateway -> lambda -> dynamodb
2. kinesis -> lambda -> event bus
3. event bus -> lambda -> lambda destination

## $200 AWS Intro Course Outline (Level 200)
1. aws set up (20 min)
2. cdk repo setup (10 min)
3. write iac(20 min)
4. add github actions and deploy (20 min)
5. ✅create api gateway handler factory and handler (10 min)
6. create dynamo table client (10 min)
  - a very small wrapper around dynamo calls for entities.
7. testing (20 min)

Total: 2 hours

## $600 AWS at Scale Courier(level 400)
- kinesis -> lambda
- dynamo -> kinesis
- event bridge -> kinesis
- kinesis -> lambda -> sns -> hydrator -> sqs
- kinesis efo
- firehose -> s3
- real cost of serverless and the downsides

1. aws account set up (20 min)
2. cdk repo set up (10 min)
3. partitions, sharding
4. marshalling
5. kinesis -> lambda
  - event source mapping
  - memory
  - provisioned concurrency
  - shard count
  - etc.
6. observability and metrics
7. kinesis -> lambda -> sns -> hydrator -> sqs
  - event source mapping
  - batch item failure
  - bisect on batch
  - max retry attempts
  - failure destination
  - timeouts

Total: 10 hours

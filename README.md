# Request validation for AWS Lambdas via JSON Schema

This is a PoC to use the [JSON Schema request validation](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-method-request-validation.html) feature for AWS Lambda functions.

This validates incoming requests at the API Gateway, before they hit your Lambda functions, against a defined schema. This means you do not need to write custom request validation code into your functions and can tie this to your API documentation, e.g. use the schema to generate OpenAPI specification for your API.

## Requires

* NodeJS
* AWS account

## Deploy

```
cd lambda
serverless deploy -v
```

## Test

Valid cURLs:
```
curl -H "Content-Type: application/json" -X POST -d '{"username":"johnsmith","description":"This is a test ticket"}' https://API_GATEWAY_URL/v1/tickets

curl -H "Content-Type: application/json" -X POST -d '{"username":"johnsmith","description":"This is a test ticket","priority":"high"}' https://API_GATEWAY_URL/v2/tickets

# Response: 200 "validated request received"
```

Invalid cURLs:
```
curl -H "Content-Type: application/json" -X POST -d '{"username":"n@me!!","description":"invalid username"}' https://API_GATEWAY_URL/v1/tickets

# Response: 422 '{"message": "Invalid request body", "error": "[ECMA 262 regex \"[A-Za-z0-9]{4,10}\" does not match input string \"n@me!!\"]"}'


curl -H "Content-Type: application/json" -X POST -d '{"description":"Missing username"}' https://API_GATEWAY_URL/v1/tickets

# Response: 422 '{"message": "Invalid request body", "error": "[object has missing required properties ([\"username\"])]"}'


curl -H "Content-Type: application/json" -X POST -d '{"username":"johnsmith","description":"This has an invalid enum value","priority":"invalid_priority_value"}' https://API_GATEWAY_URL/v2/tickets

# Response: 422 '{"message": "Invalid request body", "error": "[instance value (\"invalid_priority_value\") not found in enum (possible values: [\"high\",\"medium\",\"low\"])]"}'
```

## Notes

* As of writing, [AWS Gateway only supports](https://docs.aws.amazon.com/apigateway/api-reference/resource/model/) [JSON Schema draft-04](https://tools.ietf.org/html/draft-zyp-json-schema-04), not the latest version 2019-09
* JSON schema validation errors are returned with 422 "Unprocessable Entity" response codes

## Links

* [Serverless Framework documentation](https://serverless.com/framework/docs/providers/aws/events/apigateway/#request-schema-validation)
* [AWS Blog - How to remove boilerplate validation logic in your REST APIs with Amazon API Gateway request validation](https://aws.amazon.com/blogs/compute/how-to-remove-boilerplate-validation-logic-in-your-rest-apis-with-amazon-api-gateway-request-validation/)
* [Stackoverflow question on Serverless Framework](https://stackoverflow.com/questions/51951810/use-swagger-api-validation-with-serverless-framework)
* [JSON Schema](https://json-schema.org/)

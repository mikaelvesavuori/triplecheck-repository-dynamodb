# triplecheck-repository-dynamodb

![TripleCheck database repository](readme/triplecheck-repository.png)

## TripleCheck: DynamoDB database repository

Database utility for using DynamoDB with TripleCheck broker. It implements the repository base at [triplecheck-core](https://github.com/mikaelvesavuori/triplecheck-core).

## Basic implementation

In your `triplecheck-broker` implementation, do a regular import for `triplecheck-repository-dynamodb` and pass the repository to the broker. In a Lambda context, an implementation could look like:

```TypeScript
import { TripleCheckBroker } from 'triplecheck-broker';
import { DynamoRepository } from 'triplecheck-repository-dynamodb';

export async function handler(event: any) {
  const repository = DynamoRepository();

  const [request, payload] = await getRequestData(event);

  const { responseData, status, headers } = await TripleCheckBroker(request, payload, repository);

  const response = {
    statusCode: status,
    body: JSON.stringify(responseData),
    headers
  };

  return response;
}

/**
 * @description Utility function to get the data we need to run the TripleCheck broker.
 * Expects the full AWS Lambda event object.
 */
async function getRequestData(event: any): Promise<any> {
  const { body, httpMethod, path, queryStringParameters } = event;

  const payload = body && typeof body === 'string' ? JSON.parse(body) : body;

  const search = (() => {
    let _search = '';
    if (queryStringParameters && JSON.stringify(queryStringParameters) !== '{}') {
      _search += Object.keys(queryStringParameters)[0];
      _search += Object.values(queryStringParameters)[0];
    }
    return _search;
  })();

  return [
    {
      method: httpMethod,
      pathname: path || '/',
      search
    },
    payload
  ];
}

```

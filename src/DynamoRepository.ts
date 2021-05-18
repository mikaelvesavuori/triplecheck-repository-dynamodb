// Reference: https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-table-read-write.html

import { Repository } from 'triplecheck-core';
import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  DeleteItemCommand
} from '@aws-sdk/client-dynamodb';

const docClient = new DynamoDBClient({ region: process.env.REGION || 'eu-north-1' });
const TABLE_NAME = process.env.TABLE_NAME || 'broker-database';

export function createNewDynamoRepository() {
  return new DynamoRepository();
}

class DynamoRepository implements Repository {
  async getData(key: string): Promise<any> {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        id: { S: key }
      }
    };

    const data = await docClient.send(new GetItemCommand(params));
    let fixedData = data?.Item?.value?.S;
    if (fixedData && typeof fixedData === 'string') {
      try {
        fixedData = JSON.parse(fixedData);
      } catch (error) {
        //
      }
    }
    // @ts-ignore
    return fixedData;
  }

  async updateData(key: string, data: any): Promise<void> {
    const params = {
      TableName: TABLE_NAME,
      Item: {
        id: { S: key },
        value: { S: JSON.stringify(data) }
      }
    };

    await docClient.send(new PutItemCommand(params));
  }

  async deleteData(key: string): Promise<void> {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        id: { S: key }
      }
    };

    await docClient.send(new DeleteItemCommand(params));
  }
}

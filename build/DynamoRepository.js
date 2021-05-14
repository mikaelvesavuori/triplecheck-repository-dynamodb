"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoRepository = void 0;
const tslib_1 = require("tslib");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const docClient = new client_dynamodb_1.DynamoDBClient({ region: process.env.REGION || 'eu-north-1' });
const TABLE_NAME = process.env.TABLE_NAME || 'broker-demo';
class DynamoRepository {
    getData(key) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: TABLE_NAME,
                Key: {
                    id: { S: key }
                }
            };
            const data = yield docClient.send(new client_dynamodb_1.GetItemCommand(params));
            let fixedData = (_b = (_a = data === null || data === void 0 ? void 0 : data.Item) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.S;
            if (fixedData && typeof fixedData === 'string') {
                try {
                    fixedData = JSON.parse(fixedData);
                }
                catch (error) {
                }
            }
            return fixedData;
        });
    }
    updateData(key, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: TABLE_NAME,
                Item: {
                    id: { S: key },
                    value: { S: JSON.stringify(data) }
                }
            };
            yield docClient.send(new client_dynamodb_1.PutItemCommand(params));
        });
    }
    deleteData(key) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: TABLE_NAME,
                Key: {
                    id: { S: key }
                }
            };
            yield docClient.send(new client_dynamodb_1.DeleteItemCommand(params));
        });
    }
}
exports.DynamoRepository = DynamoRepository;
//# sourceMappingURL=DynamoRepository.js.map
import { Repository } from 'triplecheck-core';
export declare class DynamoRepository implements Repository {
    getData(key: string): Promise<any>;
    updateData(key: string, data: any): Promise<void>;
    deleteData(key: string): Promise<void>;
}

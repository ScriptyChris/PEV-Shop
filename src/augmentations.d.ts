import type { DeleteWriteOpResultObject } from 'mongodb';

declare module 'mongoose' {
    interface Document {
        save(): Promise<this>;
    }

    interface Model<T extends Document, QueryHelpers = {}> {
        find(conditions: FilterQuery<unknown>, projection?: any | null): DocumentQuery<T[], T, QueryHelpers> & QueryHelpers;
        findOne(conditions?: FilterQuery<unknown>): DocumentQuery<T | null, T, QueryHelpers> & QueryHelpers;
        deleteOne(conditions: FilterQuery<unknown>): Query<DeleteWriteOpResultObject['result'] & { deletedCount?: number }> & QueryHelpers;
        deleteMany(conditions: FilterQuery<unknown>): Query<DeleteWriteOpResultObject['result'] & { deletedCount?: number }> & QueryHelpers;
    }
}
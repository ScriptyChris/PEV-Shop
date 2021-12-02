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

declare global {
    namespace Intl {
        // https://github.com/microsoft/TypeScript/blob/main/lib/lib.es2020.intl.d.ts#L300
        interface DateTimeFormatOptions {
            dateStyle?: "full" | "long" | "medium" | "short";
            timeStyle?: "full" | "long" | "medium" | "short";
            calendar?: string;
            dayPeriod?: "narrow" | "short" | "long";
            numberingSystem?: string;
            hourCycle?: "h11" | "h12" | "h23" | "h24";
            fractionalSecondDigits?: 0 | 1 | 2 | 3;
        }
    }
}
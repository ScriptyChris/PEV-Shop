import type { DeleteWriteOpResultObject } from 'mongodb';
import type { TE2E } from '@commons/types';
import type { Cypress } from 'local-cypress';
import type { IUser } from '@database/models';

declare module 'mongoose' {
  namespace Schema {
    namespace Types {
      class Email extends String {}
    }
  }

  interface Document {
    save(): Promise<this>;
  }

  interface Model<T extends Document, QueryHelpers = {}> {
    find(conditions: FilterQuery<unknown>, projection?: any | null): DocumentQuery<T[], T, QueryHelpers> & QueryHelpers;
    findOne(conditions?: FilterQuery<unknown>): DocumentQuery<T | null, T, QueryHelpers> & QueryHelpers;
    findById(id: any | string | number): DocumentQuery<T | null, T, QueryHelpers> & QueryHelpers;
    deleteOne(
      conditions: FilterQuery<unknown>
    ): Query<DeleteWriteOpResultObject['result'] & { deletedCount?: number }> & QueryHelpers;
    deleteMany(
      conditions: FilterQuery<unknown>
    ): Query<DeleteWriteOpResultObject['result'] & { deletedCount?: number }> & QueryHelpers;
    execPopulate(path: string): this;
    execPopulate(options: ModelPopulateOptions | ModelPopulateOptions[]): this;
    populated(path: string): any;
  }
}

declare global {
  namespace Intl {
    // https://github.com/microsoft/TypeScript/blob/main/lib/lib.es2020.intl.d.ts#L300
    interface DateTimeFormatOptions {
      dateStyle?: 'full' | 'long' | 'medium' | 'short';
      timeStyle?: 'full' | 'long' | 'medium' | 'short';
      calendar?: string;
      dayPeriod?: 'narrow' | 'short' | 'long';
      numberingSystem?: string;
      hourCycle?: 'h11' | 'h12' | 'h23' | 'h24';
      fractionalSecondDigits?: 0 | 1 | 2 | 3;
    }
  }

  namespace Express {
    export interface Request {
      user?: IUser;
      token?: string;
    }
  }

  interface Window {
    Cypress: typeof Cypress;
    __E2E__: TE2E;
  }
}

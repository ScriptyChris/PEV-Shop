import getLogger from '@commons/logger';
import type { Request } from 'express';
import formidable, { PersistentFile as _PersistentFile } from 'formidable';

const logger = getLogger(module.filename);

export type TFiles = Parameters<NonNullable<Parameters<ReturnType<typeof formidable>['parse']>[1]>>[2];
export type TFile = ConstructorParameters<typeof _PersistentFile>[0];
export const PersistentFile = _PersistentFile;

export const parseFormData = async (req: Request, options?: formidable.Options) => {
  const form = formidable(options);
  const output: Partial<{
    fields: formidable.Fields;
    files: formidable.Files;
    parsingError: any;
  }> = {};

  try {
    const parsedForm: Pick<typeof output, 'fields' | 'files'> = await new Promise((resolve, reject) => {
      form.parse(req, (error, fields, files) => {
        if (error) {
          return reject(error);
        }

        resolve({ fields, files });
      });
    });

    output.fields = parsedForm.fields;
    output.files = parsedForm.files;
  } catch (error) {
    logger.error("Request's form parsing error:", error);
    output.parsingError = error;
  }

  return output;
};

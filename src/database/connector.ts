import { connect, Connection } from 'mongoose';
import { readdirSync } from 'fs';
import getLogger from '@commons/logger';
import { dotEnv } from '@commons/dotEnvLoader';

const logger = getLogger(module.filename);
const { DATABASE_PROTOCOL, DATABASE_HOST, DATABASE_PORT, DATABASE_NAME } = dotEnv;
const DATABASE_URL = `${DATABASE_PROTOCOL}://${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`;
const MAX_DB_CONNECTION_ATTEMPTS = 5;
const CONNECTION_ATTEMPT_TIMEOUT = 2000;
const requiredCollectionNames = readdirSync(`${__dirname}/populate/initialData`).map((file) => {
  const collectionName = file.match(/(?<collectionName>.*)\.json$/)?.groups?.collectionName;
  if (!collectionName) {
    throw Error(`Could not find collection name for file "${file}"!`);
  }

  return collectionName;
});

let dbConnection: Connection;

async function tryToConnectWithDB(attempts = 1): Promise<Connection | Error> {
  logger.log(`Trying to connect with MongoDB via URL '${DATABASE_URL}' at attempt ${attempts}.`);

  return new Promise((resolve: (maybeRetry?: true) => void, reject) => {
    connect(
      DATABASE_URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      },
      async function (error: Error | null, connection?: Connection) {
        if (error) {
          logger.error('Failed to connect to MongoDB! :(\nerror:', error);

          if (attempts < MAX_DB_CONNECTION_ATTEMPTS) {
            return void setTimeout(() => resolve(true), CONNECTION_ATTEMPT_TIMEOUT);
          }

          return reject(error);
        }

        dbConnection = connection!;
        dbConnection.on('error', (err) => logger.error('Connection error to DB occured!', err));
        dbConnection.on('disconnecting', () => logger.log('Disconnecting from DB...'));
        dbConnection.on('disconnected', () => logger.log('Disconnected from DB.'));

        return resolve();
      }
    );
  }).then((maybeRetry: true | void) => {
    if (maybeRetry === true) {
      logger.log('Retrying connection with DB...');

      return tryToConnectWithDB(attempts + 1);
    }

    logger.log('Connected to MongoDB!');

    return dbConnection;
  });
}

export async function connectWithDB() {
  if (dbConnection) {
    return dbConnection;
  }

  return tryToConnectWithDB();
}

export async function getPopulationState() {
  if (!dbConnection) {
    return false;
  }

  try {
    const collections = await dbConnection.db.listCollections().toArray();
    const requiredCollectionsReady = requiredCollectionNames.every((reqColName) =>
      collections.find(({ name }) => reqColName === name)
    );

    return requiredCollectionsReady;
  } catch (dbPopulationStateCheckError) {
    logger.error('dbPopulationStateCheckError:', dbPopulationStateCheckError);

    return false;
  }
}

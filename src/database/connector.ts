import { connect, Connection } from 'mongoose';
import { readdirSync } from 'fs';
import getLogger from '../../utils/logger';

const logger = getLogger(module.filename);

console.log('[connector] 000 --- script');

const MAX_DB_CONNECTION_ATTEMPTS = 5;
const CONNECTION_ATTEMPT_TIMEOUT = 2000;
const requiredCollectionNames = readdirSync(`${__dirname}/populate`)
  .filter((file) => /^initial-.*\.json$/.test(file))
  .map((file) => file.match(/^initial-(?<collectionName>.*).json$/)?.groups?.collectionName);

const { DATABASE_PROTOCOL, DATABASE_HOST, DATABASE_PORT, DATABASE_NAME } = process.env;
const DATABASE_URL = `${DATABASE_PROTOCOL}://${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`;
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
            console.log('[connector tryToConnectWithDB()] --- before timeout resolve');

            return void setTimeout(() => {
              console.log('[connector tryToConnectWithDB()] --- timeout resolve');

              resolve(true);
            }, CONNECTION_ATTEMPT_TIMEOUT);
          }

          return reject(error);
        }

        logger.log('Connected to MongoDB.');

        dbConnection = connection!;

        console.log('[connector tryToConnectWithDB()] --- resolve');

        return resolve();
      }
    );
  }).then((maybeRetry: true | void) => {
    if (maybeRetry === true) {
      console.log('[connector tryToConnectWithDB()] --- retry after resolve');

      return tryToConnectWithDB(attempts + 1);
    }

    return dbConnection;
  });
}

export async function getDBConnection() {
  console.log('[connector getDBConnection()] dbConnection:', !!dbConnection);

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
    console.log(
      '[connector getPopulationState()] --- /Connection constructor:',
      Object.getPrototypeOf(Connection).constructor,
      ' /Connection keys: ',
      Object.keys(Connection)
    );

    const collections = await dbConnection.db.listCollections().toArray();

    console.log(
      '[connector getPopulationState()] --- collections:',
      collections,
      ' /requiredCollectionNames:',
      requiredCollectionNames
    );

    const requiredCollectionsReady = requiredCollectionNames.every((reqColName) =>
      collections.find(({ name }) => reqColName === name)
    );

    console.log('[connector getPopulationState()] --- /requiredCollectionsReady:', requiredCollectionsReady);

    return requiredCollectionsReady;
  } catch (dbPopulationStateCheckError) {
    console.error('[connector getPopulationState()] --- dbPopulationStateCheckError:', dbPopulationStateCheckError);

    return false;
  }
}

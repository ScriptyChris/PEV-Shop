import { connect, Connection } from 'mongoose';
import { readdirSync } from 'fs';
import getLogger from '../../utils/logger';

const logger = getLogger(module.filename);

console.log('000 --- script');

const MAX_DB_CONNECTION_ATTEMPTS = 5;
const CONNECTION_ATTEMPT_TIMEOUT = 2000;
const populationState = (() => {
  console.log('111 --- IIFE');

  const requiredCollectionNames = readdirSync(`${__dirname}/populate`)
    .filter((file) => /^initial-.*\.json$/.test(file))
    .map((file) => file.match(/^initial-(?<collectionName>.*).json$/)?.groups?.collectionName);
  let _state: boolean | null = null;

  return {
    async set(connection: Connection) {
      try {
        console.log(
          '222 --- /Connection constructor:',
          Object.getPrototypeOf(Connection).constructor,
          ' /Connection keys: ',
          Object.keys(Connection)
        );

        const collections = await connection.db.listCollections().toArray();

        console.log('333 --- collections:', collections, ' /requiredCollectionNames:', requiredCollectionNames);

        const requiredCollectionsReady = requiredCollectionNames.every((reqColName) =>
          collections.find(({ name }) => reqColName === name)
        );

        console.log('444 --- /requiredCollectionsReady:', requiredCollectionsReady);

        _state = requiredCollectionsReady;
      } catch (e) {
        console.error('555 --- error:', e);
      }
    },
    get() {
      console.log('666 --- [getter] /_state:', _state);
      return _state;
    },
  };
})();

export async function tryToConnectWithDB(attempts = 1): Promise<void | Error> {
  const { DATABASE_PROTOCOL, DATABASE_HOST, DATABASE_PORT, DATABASE_NAME } = process.env;
  const DATABASE_URL = `${DATABASE_PROTOCOL}://${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`;

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
            console.log('777 --- before timeout resolve');

            // return setTimeout(() => tryToConnectWithDB(callback, attempts + 1), CONNECTION_ATTEMPT_TIMEOUT);
            return void setTimeout(() => {
              console.log('777.5555 --- timeout resolve');

              resolve(true);
            }, CONNECTION_ATTEMPT_TIMEOUT);
          }

          return reject(error);
        }

        logger.log('Connected to MongoDB.');

        await populationState.set(connection!);

        console.log('777 --- resolve');

        return resolve();
      }
    );
  }).then((maybeRetry: true | void) => {
    if (maybeRetry === true) {
      console.log('888 --- retry after resolve');
      return tryToConnectWithDB(attempts + 1);
    }
  });
}

export const getPopulationState = () => populationState.get();

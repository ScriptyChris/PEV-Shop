import { connect, Connection } from 'mongoose';
import { readdirSync } from 'fs';
import getLogger from '../../utils/logger';

const logger = getLogger(module.filename);
const MAX_DB_CONNECTION_ATTEMPTS = 5;
const CONNECTION_ATTEMPT_TIMEOUT = 2000;
const populationState = (() => {
  const requiredCollectionNames = readdirSync(`${__dirname}/populate`)
    .filter((file) => /^initial-.*\.json$/.test(file))
    .map((file) => file.match(/^initial-(?<collectionName>.*).json$/)?.groups?.collectionName);
  let _state = false;

  return {
    async set(connection: Connection) {
      const collections = await connection.db.listCollections().toArray();
      const requiredCollectionsReady = requiredCollectionNames.every((reqColName) =>
        collections.find(({ name }) => reqColName === name)
      );

      _state = requiredCollectionsReady;
    },
    get() {
      return _state;
    },
  };
})();

function defaultCallbackHandler(error: Error | null, connection?: Connection) {
  if (error) {
    logger.error('MongoDB connection failed! Error:', error);
  }
}

export function tryToConnectWithDB(callback = defaultCallbackHandler, attempts = 1) /* : Promise<void | MongoError> */ {
  const { DATABASE_PROTOCOL, DATABASE_HOST, DATABASE_PORT, DATABASE_NAME } = process.env;
  const DATABASE_URL = `${DATABASE_PROTOCOL}://${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`;

  logger.log(`Trying to connect with MongoDB via URL '${DATABASE_URL}' at attempt ${attempts}.`);

  connect(
    DATABASE_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
    function (error: Error | null, connection?: Connection) {
      if (error) {
        logger.error('Failed to connect to MongoDB! :(\nerror:', error);

        if (attempts < MAX_DB_CONNECTION_ATTEMPTS) {
          return setTimeout(() => tryToConnectWithDB(callback, attempts + 1), CONNECTION_ATTEMPT_TIMEOUT);
        }

        return callback(error);
      }

      logger.log('Connected to MongoDB.');

      populationState.set(connection!);
      callback(null, connection);
    }
  );
}

export const getPopulationState = () => populationState.get();

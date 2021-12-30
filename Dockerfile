FROM node:fermium-alpine3.13

WORKDIR /app

COPY ./package*.json ./
RUN npm ci

COPY ./src ./src
COPY ./utils ./utils
COPY \
    .env \
    .babelrc \
    .eslintrc.js \
    .prettierrc \
    tsconfig* \
    webpack.config.js \
    ./

RUN npm run build

# TODO: automate database population process on Docker image build. 
#       Need to handle race condition between starting MongoDB.
#WORKDIR /app/dist/src/database/populate
#RUN node populate.js --categoriesGroupPath=categoryGroups.json trialProducts.json

EXPOSE ${APP_PORT}

CMD ["npm", "run", "serve"]
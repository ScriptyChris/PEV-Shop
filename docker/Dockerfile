FROM node:fermium-alpine3.13

WORKDIR /app

COPY ./package*.json ./
RUN npm ci

COPY ./src ./src
COPY ./commons ./commons
COPY ./public ./public
COPY \
    .env \
    .babelrc \
    .eslintrc.js \
    .prettierrc \
    tsconfig* \
    webpack.config.js \
    ./
COPY ./scripts/generate-grouped-api-docs.js ./scripts/generate-grouped-api-docs.js

RUN npm run build

EXPOSE ${APP_PORT}

CMD ["npm", "run", "serve"]
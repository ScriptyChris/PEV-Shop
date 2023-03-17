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
    scripts/generate-grouped-api-docs.js \
    webpack.config.js \
    ./

RUN npm run build

EXPOSE ${APP_PORT}

CMD ["npm", "run", "serve"]
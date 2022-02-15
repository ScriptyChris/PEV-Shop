FROM node:fermium-alpine3.13

WORKDIR /app

COPY ./package*.json ./
RUN npm ci

COPY ./src ./src
COPY ./utils ./utils
COPY \
    .env* \
    .babelrc \
    .eslintrc.js \
    .prettierrc \
    tsconfig* \
    webpack.config.js \
    ./

# if `.env` file doesn't exist, create it based on `.env.example`
RUN test -e .env || cp .env.example .env

RUN npm run build

EXPOSE ${APP_PORT}

RUN ["sh", "-c", "ls -las"]
RUN ["sh", "-c", "cat .env.example"]
RUN ["sh", "-c", "cat .env"]

CMD ["npm", "run", "serve"]
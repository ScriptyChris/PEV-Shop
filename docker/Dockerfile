FROM node:fermium-alpine3.13

WORKDIR /app

COPY ./package*.json ./
RUN npm ci

COPY ./src ./src
COPY ./commons ./commons
COPY \
    .env \
    .babelrc \
    .eslintrc.js \
    .prettierrc \
    tsconfig* \
    generate-grouped-api-docs.js \
    webpack.config.js \
    ./
RUN mkdir --parents public/images/products/__form-parsing-tmp

#### debugging
RUN echo "listing 'public/' folder recursively below..."
RUN ls -la public && \
    ls -la public/images && \
    ls -la public/images/products
####

RUN npm run build

EXPOSE ${APP_PORT}

CMD ["npm", "run", "serve"]
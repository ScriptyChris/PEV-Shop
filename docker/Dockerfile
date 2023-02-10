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
    generate-grouped-api-docs.js \
    webpack.config.js \
    ./
#RUN mkdir --parents public/images/products/__form-parsing-tmp

#### debugging
RUN echo "===[Docker pre-build] listing 'public/' folder recursively below..." && \
    ls -la public && \
    ls -la public/images && \
    ls -la public/images/products
####

RUN npm run build

#### debugging
RUN echo "===[Docker post-build] listing 'public/' folder recursively below..." && \
    ls -la public && \
    ls -la public/images && \
    ls -la public/images/products
####

EXPOSE ${APP_PORT}

CMD ["npm", "run", "serve"]
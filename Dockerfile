FROM node:lts-alpine3.13

COPY ./package*.json ./
RUN npm ci

COPY ./src ./src
COPY ./utils ./utils
COPY .env .babelrc tsconfig* webpack.config.js ./
RUN npm run build

COPY ./dist ./

EXPOSE 3000

CMD ["npm", "run", "serve"]
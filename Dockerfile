# Build image: docker build -t pev-shop-dev .
# Run container: docker run --mount type=bind,source="$(pwd)",target=/app pev-shop-dev

FROM node:lts-alpine3.13

WORKDIR /app

COPY ./package*.json ./
RUN npm ci && ls ./
RUN npm run build && ls ./

COPY ./dist .env ./

CMD ["npm", "run", "serve"]

#RUN npm ci; touch _test_file_.txt; ls ./
#CMD npm ci && npm run dev:frontend
#CMD ls ./ && npm run dev:frontend
#CMD ["npm", "run", "dev:frontend"]

#CMD ["sleep", "3600"]

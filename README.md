# PEV-Shop

[**P**ersonal **E**lectric **V**ehicle](https://en.wikipedia.org/wiki/Personal_transporter#Types) Shop application.

<!-- Placeholder for injecting DISCLAIMER.html file -->
<!-- START_OF disclaimer -->
> <b>DISCLAIMER:</b> this application is meant for <strong>demo purposes only</strong> - it does <em>NOT</em> represent 
a real shop at any moment. Informations about products availability are fake; remaining products informations may be 
fake or out-of-date. <em>NO</em> purchases will actually be sold <em>NOR</em> delivered, <em>NO</em> payment related 
actions will be realized - these are only simulated in the application. <strong>Please avoid providing</strong> 
any of your <strong>real personal informations</strong> (like logins, passwords, emails, addresses, payment card's PIN or BLIK codes, etc.) 
on any of the application's pages or views, including any redirections to external services (such as bank related) - 
<strong>please use fake data</strong> anywhere across the application instead. Application's author does <em>NOT</em> 
take any responsibility for users possible data loss <em>NOR</em> actions made by users.
<!-- END_OF disclaimer -->

## Table of Contents
1. [Live version and preview](#1-live-version-and-preview)
2. [Features](#2-features)
3. [Tech stack](#3-tech-stack)
4. [Setup](#4-setup)
    - [automatic (Docker based)](#automatic-setup)
    - [manual](#manual-setup)
        - [database](#manual-database-setup)
        - [email service](#manual-email-service-setup)
        - [app](#manual-app-setup)
5. [Tests](#5-tests)
6. [API documentation](#6-api-documentation)
    - [middleware](https://github.com/ScriptyChris/PEV-Shop/blob/develop/api-docs/middleware.md)
    - [database](https://github.com/ScriptyChris/PEV-Shop/blob/develop/api-docs/database.md)
    - [frontend](https://github.com/ScriptyChris/PEV-Shop/blob/develop/api-docs/frontend.md)
    - [commons](https://github.com/ScriptyChris/PEV-Shop/blob/develop/api-docs/commons.md)
7. [Development](#7-development)
8. [Credits](#8-credits)

## 1. Live version and preview
The app is available live online: https://pev-shop.scriptychris.dev/.

Below you can watch a brief preview, which presents:
1) welcome page, 
2) home page, 
3) products dashboard, 
4) chosen products pages, 
5) registration, 
6) mail service, 
7) login, 
8) searching products, 
9) products comparison, 
10) cart and ordering process.


![Preview video: https://github.com/ScriptyChris/PEV-Shop/blob/develop/pev-shop-preview.mp4?raw=true](https://github.com/ScriptyChris/PEV-Shop/blob/develop/pev-shop-preview.mp4?raw=true)


## 2. Features
App offers the following features (with [ideas to add more](https://github.com/ScriptyChris/PEV-Shop/issues?q=is%3Aopen+is%3Aissue+label%3Aenhancement)):
- client and seller **user accounts**:
    - **registering**,
    - **logging in**,
    - **resetting password**
- **searching for products**, including a list of recent searches
- **browsing** chosen **products** with their data listed, including gallery, reviews and links to related products
- **listing** available **products**, including:
    - **filtering** according to alikes: price, category, specifications,
    - **sorting** and **pagination**
- **comparing** between multiple products
- **adding**, **modifying** and **removing** products
- support for **mobile**, **tablet** and **PC** devices
- **making orders** for products added to the cart with **various payment and shipment methods**
- **reviewing** bought products
## 3. Tech stack
<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=react,scss,mui,webpack,typescript,nodejs,express,mongo,docker,githubactions,jest" alt="React, SCSS, MUI, Webpack, TypeScript, NodeJS, Express, Mongo, Docker, GitHub Actions and Jest logos" title="React, SCSS, MUI, Webpack, TypeScript, NodeJS, Express, Mongo, Docker, GitHub Actions and Jest" />
  </a>
  <a href="https://www.cypress.io">
    <img src="https://www.cypress.io/favicon.svg" alt="Cypress logo" title="Cypress" width="48" height="48" />
  </a>
  <a href="https://formik.org">
    <img src="https://formik.org/images/favicon.png" alt="Formik logo" title="Formik" width="48" height="48"/>
  </a>
  <a href="https://mobx.js.org">
    <img src="https://mobx.js.org/img/favicon.png" alt="MobX logo" title="MobX" width="48" height="48"/>
  </a>
</p>

App's [frontend](https://github.com/ScriptyChris/PEV-Shop/blob/develop/src/frontend) is built with [**React**](https://reactjs.org/) (and partial [**TypeScript**](https://typescriptlang.org/) usage). Global state is handled by [**MobX**](https://mobx.js.org/). Layouts are made with a mix of custom [**SCSS**](http://sass-lang.com/) and [**Material-UI**](https://v4.mui.com/). Forms are created with [**Formik**](https://formik.org/). Products shipment via parcels is possible due to [**InPost's Geowidget**](https://dokumentacja-inpost.atlassian.net/wiki/spaces/PL/pages/7438409/Geowidget+v4+User+s+Guide+Old). Frontend is bundled with [**webpack**](http://webpackjs.org/).

Backend is written on [**Node.js**](https://nodejs.org/) in **TypeScript**, with [middleware](https://github.com/ScriptyChris/PEV-Shop/blob/develop/src/middleware) based on [**Express.js**](https://expressjs.com/) (supporting Rest API) and [database](https://github.com/ScriptyChris/PEV-Shop/blob/develop/src/database) created with [**MongoDB**](https://www.mongodb.com/) (using [**Mongoose**](https://mongoosejs.com/) as ODM). Authorization is implemented via [**JWT**](https://www.npmjs.com/package/jsonwebtoken) and custom user roles system. Emails to users are send via [**Nodemailer**](https://www.npmjs.com/package/nodemailer) and hosted with [**MailHog**](https://github.com/mailhog/MailHog). Payments for ordered products are handled by integrated [**PayU API**](https://developers.payu.com/en/).

The app's database and middleware are covered with [*unit* tests](https://github.com/ScriptyChris/PEV-Shop/blob/develop/test/unit) created with [**Jest**](https://jestjs.io/). Whole-feature focused scenarios are covered by [*end-to-end* tests](https://github.com/ScriptyChris/PEV-Shop/blob/develop/test/e2e) created with [**Cypress**](https://www.cypress.io/).

Whole app is containerized via [**Docker**](https://docker.com/), which helps with easier setup and executing end-to-end tests. Repository is hooked with [**GitHub Actions CI/CD**](https://docs.github.com/en/actions) for integration purposes.
## 4. Setup
Regardles of setup method, the app is locally served on [`http://localhost:3000`](http://localhost:3000) by default.
### Automatic setup
Whole app can be bootstrapped with [Docker](https://www.docker.com/).
1. Create `.env` file based on [`.env.example`](https://github.com/ScriptyChris/PEV-Shop/blob/develop/.env.example).
2. Navigate to [`./docker`](https://github.com/ScriptyChris/PEV-Shop/blob/develop/docker) folder with command:
```sh
cd docker
```

3. Start Docker (if your Docker setup requires `sudo` access, you may be prompted to type your password):

<small>*NOTE:* installation downloads and processes a few GB of data, so it may take a while.</small>
```sh
sudo docker-compose --env-file ../.env -f docker-compose.yml -f docker-compose.app-standalone-volumes.yml up
```

This will install all necessary dependencies, populate database with initial data and serve the app.

### Manual setup
#### Manual database setup
Database has been created using MongoDB v4.2.0 with [mongodb v3.5.10](https://www.npmjs.com/package/mongodb/v/3.5.10) and [mongoose v5.9.27](https://www.npmjs.com/package/mongoose/v/5.9.27) NPM packages.

To install MongoDB database locally, please download and install it on your machine from this URL: https://fastdl.mongodb.org/win32/mongodb-win32-x86_64-2012plus-4.2.9-signed.msi (you can skip first three below steps then) or follow these steps:
1. Go to https://www.mongodb.com/try/download/community
2. Choose "MongoDB Community Server" tab
3. Choose latest 4.2 version from "Available Downloads" section and download it
4. Install database by following the setup program
5. Create **data** folder inside project's **database** folder (*NOTE: **database/data** folder is set to be ignored by Git*)
6. Start the MongoDB running the following command (i assume you are using Windows with default installation path - if not, please adjust the path accordingly)
`  C:\Program Files\MongoDB\Server\4.2\bin\mongod.exe --dbpath="absolute_path_to_project_root\database\data"`

In case of any issues, please refer to the official MongoDB installation guide for your operating system [[Windows](https://docs.mongodb.com/v4.2/tutorial/install-mongodb-on-windows/) / [Linux](https://docs.mongodb.com/v4.2/administration/install-on-linux/) / [macOS](https://docs.mongodb.com/v4.2/tutorial/install-mongodb-on-os-x/)].

#### Manual email service setup
The app is integrated with **MailHog** email service, which you can [install from it's repository](https://github.com/mailhog/MailHog#installation). 
By default, this service's website is available on [EMAIL_WEB_HTTP_PORT](https://github.com/ScriptyChris/PEV-Shop/blob/develop/.env.example) `8025`. You may need to change [EMAIL_INTERNAL_HOST](https://github.com/ScriptyChris/PEV-Shop/blob/develop/.env.example) env variable to `localhost`, if you want to use your system's MailHog instead of the instance from Docker.

#### Manual app setup
The app building process is based on Node.js v14 LTS and npm, so after [installing it](https://nodejs.org/download/release/latest-fermium/) (optionally via [NVM](https://github.com/nvm-sh/nvm)) do the following:
1. Install dependencies by command:
```sh
npm ci
```
2. Build project:
```sh
npm build
```
3. Create `.env` file based on [`.env.example`](https://github.com/ScriptyChris/PEV-Shop/blob/develop/.env.example). Change `DATABASE_HOST` variable in `.env` file to `localhost` value.

4. Serve the app:
```sh
npm serve
```

## 5. Tests
The app contains [**unit** and **end-to-end** tests](#3-tech-stack). You can run them as following:
- unit tests:
```sh
npm run test:unit
```
- end-to-end tests:

<small>*NOTE*: it requires [Docker](https://www.docker.com/) installation and `DATABASE_HOST` variable in `.env` file set to `pev-db` value.</small>
```sh
npm run test:e2e:dev
```

## 6. API documentation
API docs are generated by [**TypeDoc**](https://npmjs.com/package/typedoc), which output is [grouped](https://github.com/ScriptyChris/PEV-Shop/blob/develop/scripts/generate-grouped-api-docs.js) into [a few folders](https://github.com/ScriptyChris/PEV-Shop/blob/develop/api-docs).

## 7. Development
If you would like to play with the application's code, [*package.json* file](https://github.com/ScriptyChris/PEV-Shop/blob/develop/package.json) contains helpful NPM commands, for example:
- populate database with default initial data and included cleanup (in case you would like to reset database state)
```sh
npm run populate-db
```
- develop frontend with React's hot module replacement
```sh
npm run dev:frontend
```
- develop backend with automatic ad-hoc builds
```sh
npm run dev:backend
```
- debug backend with [Google Chrome's Devtools](https://nodejs.org/en/docs/guides/debugging-getting-started/#inspector-clients) (or compliant tool)
```sh
npm run debug
```
- generate API documentation based on current source code (with restriction to files listed in [grouping script](https://github.com/ScriptyChris/PEV-Shop/blob/develop/scripts/generate-grouped-api-docs.js))
```sh
npm run generate-api-docs
```

## 8. Credits
- initial products data is based on the [**eWheels** shop](https://www.ewheels.com/)
- tech stack icons are provided by [https://github.com/tandpfun/skill-icons](https://github.com/tandpfun/skill-icons)
- the app's (favicon) icon is provided by [**Icons8**](https://icons8.com)

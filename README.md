# Fake-PEV-Shopping
Fake Personal Electric Vehicle Shopping application. Browse, compare, buy, review vehicles and their accessories.

## Table of Contents
1. Features
2. Technology stack
3. [Setup](#setup)
    - [database](#database)
    - frontend
4. ...

## Setup
### Database
This app has been created using MongoDB v4.2.0 with related NPM packages:
- <a href="https://www.npmjs.com/package/mongodb/v/3.5.10">mongodb v3.5.10</a>
- <a href="https://www.npmjs.com/package/mongoose/v/5.9.27">mongoose v5.9.27</a>

To install MongoDB database locally, please download and install it on your machine from this URL: https://fastdl.mongodb.org/win32/mongodb-win32-x86_64-2012plus-4.2.9-signed.msi (you can skip first three below steps then) or follow these steps:
1. Go to https://www.mongodb.com/try/download/community
2. Choose "MongoDB Community Server" tab
3. Choose latest 4.2 version from "Available Downloads" section and download it
4. Install database by following the setup program
5. Create **data** folder inside project's **database** folder (*NOTE: **database/data** folder is set to be ignored by Git*)
6. Start the MongoDB running the following command (i assume you are using Windows with default installation path - if not, please adjust the path accordingly)
`  C:\Program Files\MongoDB\Server\4.2\bin\mongod.exe --dbpath="absolute_path_to_project_root\database\data"`

In case of any issues, please refer to the official MongoDB installation guide for your operating system [<a href="https://docs.mongodb.com/v4.2/tutorial/install-mongodb-on-windows/">Windows</a> / <a href="https://docs.mongodb.com/v4.2/administration/install-on-linux/">Linux</a> / <a href="https://docs.mongodb.com/v4.2/tutorial/install-mongodb-on-os-x/">macOS</a>].

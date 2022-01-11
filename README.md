# Coodesh Backend Test - Space Flight Articles

> This is a challenge by [Coodesh](https://coodesh.com/)

[Test this application](https://space-flight-articles.herokuapp.com/)

This API is based on [Spaceflight News API](https://api.spaceflightnewsapi.net/v3/documentation). It allow the user to add events, launches and
mainly articles.

## Stack + Libs used
- Node.JS
- Typescript
- ExpressJS
- Express Validator
- Nodemailer
- PostgreSQL (node-pg)

## Installation and Setup

Clone this project, install all dependencies with `yarn` or `npm install`

You will need a PostgreSQL database to run this project. To this, you can spin up a postgres database with **docker-compose**

```
docker-compose up
```

The database structure is inside `setup-database.sql`. First connect to the postgres (with the command line), if don't have the database created yet, create it with:

```
CREATE DATABASE space-flight-articles;
```

Then connect to the database with `\c space-flight-articles`

Finally copy the `setup-database.sql` content (located at the root of the project) to the command line.

### Env

Now you need to add and configure the `.env` file. This is a example env (can also be found in the project as `.env.example`):

```
# Mailer
GMAIL_SENDER_EMAIL=
GMAIL_SENDER_PASSWORD=
REPORT_RECEIVER_EMAIL=

# Postgres
POSTGRES_HOST=localhost
POSTGRES_DATABASE=space_flight_articles
POSTGRES_PORT=5432
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin

# Cron
CRON_ACTIVE=true
SYNC_FETCH_API=https://api.spaceflightnewsapi.net/v3

# Port
PORT=8080

# Swagger
SWAGGER_API_SERVER=

# Testing
TEST_POSTGRES_HOST=localhost
TEST_POSTGRES_DATABASE=space_flight_articles_test
TEST_POSTGRES_PORT=5433
TEST_POSTGRES_USER=test
TEST_POSTGRES_PASSWORD=test
```

|Varible|Description|
|-|-|
GMAIL_SENDER_EMAIL|Gmail used to send the script failure reports
GMAIL_SENDER_PASSWORD|Gmail password from GMAIL_SENDER_EMAIL
REPORT_RECEIVER_EMAIL|Who is going to receive the script failure reports
POSTGRES_HOST|localhost
POSTGRES_DATABASE|space_flight_articles
POSTGRES_PORT|5432
POSTGRES_USER|admin
POSTGRES_PASSWORD|admin
CRON_ACTIVE|If is to run CRON scripts
SYNC_FETCH_API|https://api.spaceflightnewsapi.net/v3
PORT|Port where the app is going run
SWAGGER_API_SERVER|Url of this API to be added in servers list of swagger
TEST_POSTGRES_HOST|localhost
TEST_POSTGRES_DATABASE|space_flight_articles_test
TEST_POSTGRES_PORT|5433
TEST_POSTGRES_USER|test
TEST_POSTGRES_PASSWORD|test

## Usage

To run the project simply run `yarn start` or `npm run start`.

You access the API documentation on `/docs` endpoint. The documentation is also available [here](https://space-flight-articles.herokuapp.com/docs)

## Scripts Usage

The script `sync-article-from-api` runs every day at 9 AM. You disable this behavior by setting the env **CRON_ACTIVE** to `false`

You can manually run this script by executing `yarn scripts:syncArticlesWithApi` or `npm run scripts:syncArticlesWithApi`

## Testing

This project has a simple end-2-end tests (endpoints), and one unit test (script). To the end-2-end tests you will need a testing database.

Currently, there is two ways of running the test:

1. By running `yarn test` or `npm t`,
2. By running `yarn test:docker` or `npm run test:docker` (docker-compose needed). It will spin up a postgres docker container just for testing

In any case you will need to set the `TEST_*` environment variables in the `.env` file. If you choose by using your own or a custom database for testing, set it's configuration on `TEST_*` of `.env`. If you choose the automatic docker way, set the TEST variables as following:

```
TEST_POSTGRES_HOST=localhost
TEST_POSTGRES_DATABASE=space_flight_articles_test
TEST_POSTGRES_PORT=5433
TEST_POSTGRES_USER=test
TEST_POSTGRES_PASSWORD=test
```

## .gitignore

```
.env
node_modules/
build/
src/scripts/data/
npm-debug.log
```

> This is a challenge by [Coodesh](https://coodesh.com/)
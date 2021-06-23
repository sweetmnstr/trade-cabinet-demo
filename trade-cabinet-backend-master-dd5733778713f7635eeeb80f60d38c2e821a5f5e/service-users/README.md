<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) CloudMining backend.

## Installation

```bash
$ npm install
```

## Build the app
```bash
$ npm run build
```

## Migration commands
All commands described for *.ts* migrations files
For built *.js* files use ```migrate:build:YOUR_COMMAND```.

```bash
# Generate migrations
$ npm run migrate:gen MIGRATION_NAME

# Up/Run migrations
$ npm run migrate:run

# Down migrations
$ npm run migrate:down
```

## Running the app

```bash
# simply using node
$ node ./build

# Or using process manager
# Built-in NPM - PM2 commands-
$ npm run start
$ npm run stop
$ npm run log
## Restart and log
$ npm run relog
```

## Test

```bash
# unit tests
$ npm run test

# unit tests with watch
$ npm run test:watch

# test coverage
$ npm run test:cov
```
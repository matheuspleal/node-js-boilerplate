![Node.js Boilerplate](https://i.imgur.com/onA5Z5h.jpg)
<div align="center">
  <h1>Node.js Boilerplate</h1>
  <a href="https://github.com/matheuspleal/node-js-boilerplate/actions">
    <img src="https://github.com/matheuspleal/node-js-boilerplate/actions/workflows/ci.yml/badge.svg?branch=main" alt="Build Status">
  </a>
  <a href="https://coveralls.io/github/matheuspleal/node-js-boilerplate?branch=main">
    <img src="https://coveralls.io/repos/github/matheuspleal/node-js-boilerplate/badge.svg?branch=main" alt="Coverage Status">
  </a>
  <a href="http://standardjs.com">
    <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg" alt="js-standard-style">
  </a>
  <a href="https://www.gnu.org/licenses/gpl-3.0.en.html">
  <img src="https://img.shields.io/badge/License-GPL%20v3-yellow.svg" alt="GPLv3 License">
  </a>
  <br />
  <hr />
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#context">Context</a></li>
      </ul>
    </li>
    <li>
      <a href="#libraries-and-tools">Libraries and Tools</a>
      <ul>
        <li><a href="#dependencies">Dependencies</a></li>
        <li><a href="#dev-dependencies">Dev Dependencies</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#optionals">Optionals</a></li>
        <li><a href="#env-variables">Env Variables</a></li>
        <li><a href="#preparing">Preparing</a></li>
        <li><a href="#run-tests">Run Tests</a></li>
        <li><a href="#start-server">Start Server</a></li>
      </ul>
    </li>
    <li>
      <a href="#in-production">In Production</a>
      <ul>
        <li><a href="#rest-api-docs">REST API Docs</a></li>
        <li><a href="#graph-ql-playground">GraphQL Playground</a></li>
      </ul>
    </li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About The Project
The **Node.js Boilerplate** is a project developed in TypeScript that uses concepts of **Clean Architecture** and **Domain-Driven Design (DDD)** to maintain a decoupled and domain-centered application structure.

In addition, various other design patterns are applied throughout the project to solve common software design problems encountered during the development process.

Finally, the use of **Test-Driven Development (TDD)** ensures several benefits for the code, such as better design, quality, greater development agility, and ease of maintenance and refactoring.

### Context
The project's goal is to demonstrate how it is possible to develop software in a decoupled manner. The example used in this boilerplate covers two bounded contexts: **Users** and **Notifications**.

The **Users** context handles **Sign Up** and **Sign In** (issuing the JWT access token), plus authenticated endpoints to **Fetch Users** (paginated) and **Get User By Id**.

The **Notifications** context is triggered reactively: when a user signs up, a `UserCreatedEvent` is dispatched and the `OnUserCreated` subscriber persists a welcome notification. Authenticated endpoints expose **Fetch Notifications By Recipient** and **Read Notification**.

Interaction with the API can be done in two ways, through the **REST API** or the **GraphQL API**.

### Patterns
Beyond Clean Architecture + DDD, the codebase applies:

- **Either monad** for explicit error handling across domain and application layers (no thrown exceptions from business logic).
- **Aggregate Root + Domain Events** with a dispatcher (`DomainEvents.dispatchEventsForAggregate`) called by repositories after persistence. Subscribers are fire-and-forget — a subscriber failure never aborts the emitting aggregate.
- **Specification pattern** for composable domain rules (`.and()`, `.or()`, `.not()`).
- **WatchedList** to track incremental `added`/`removed` items in aggregate collections.
- **Value Objects** (`EmailVO`, `PasswordVO`, `BirthdateVO`) with validated `create()` and persistence-only `reconstitute()`.
- **Manual DI via factories** (no container) — `make<Name>()` functions wire dependencies by hand under `src/main/factories/`.
- **Fluent validator builder** on controllers: `required()`, `isValidUUID()`, `isValidPassword()`, `isEmail()`, `isValidDate()`.
- **Graceful shutdown** on `SIGTERM`/`SIGINT`: drains Fastify, disconnects Prisma, force-exits after `SERVER_SHUTDOWN_TIMEOUT_IN_MS` (default 10s).

## Libraries And Tools
This section describes the main **libraries** and **tools** used in the project, separated between development and production dependencies.

### Dependencies
- [@apollo/server](https://github.com/apollographql/apollo-server) - 5.3.0
- [@as-integrations/fastify](https://www.npmjs.com/package/@as-integrations/fastify) - 3.1.0
- [@fastify/cors](https://github.com/fastify/fastify-cors) - 11.2.0
- [@fastify/swagger](https://github.com/fastify/fastify-swagger) - 9.6.1
- [@prisma/adapter-pg](https://github.com/prisma/prisma) - 7.3.0
- [@prisma/client](https://github.com/prisma/prisma) - 7.3.0
- [@scalar/fastify-api-reference](https://github.com/scalar/scalar?tab=readme-ov-file#fastify) - 1.43.15
- [@scalar/themes](https://github.com/scalar/scalar#themes) - 0.13.26
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) - 3.0.3
- [fastify](https://github.com/fastify/fastify) - 5.7.2
- [graphql](https://github.com/graphql/graphql-js) - 16.12.0
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - 9.0.3
- [pg](https://github.com/brianc/node-postgres) - 8.17.2
- [zx](https://github.com/google/zx) - 8.8.5

### Dev Dependencies
- [@commitlint/cli](https://github.com/conventional-changelog/commitlint) - 20.3.1
- [@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint) - 20.3.1
- [@eslint/js](https://eslint.org/) - 9.39.2
- [@faker-js/faker](https://fakerjs.dev/) - 10.2.0
- [@semantic-release/changelog](https://www.npmjs.com/package/@semantic-release/changelog) - 6.0.3
- [@semantic-release/commit-analyzer](https://www.npmjs.com/package/@semantic-release/commit-analyzer) - 13.0.1
- [@semantic-release/git](https://www.npmjs.com/package/@semantic-release/git) - 10.0.1
- [@semantic-release/github](https://www.npmjs.com/package/@semantic-release/github) - 12.0.2
- [@semantic-release/release-notes-generator](https://www.npmjs.com/package/@semantic-release/release-notes-generator) - 14.1.0
- [@types/eslint-config-prettier](https://www.npmjs.com/package/@types/eslint-config-prettier) - 6.11.3
- [@types/jsonwebtoken](https://www.npmjs.com/package/@types/jsonwebtoken) - 9.0.10
- [@types/node](https://www.npmjs.com/package/@types/node) - 25.0.10
- [@types/pg](https://www.npmjs.com/package/@types/pg) - 8.16.0
- [@types/supertest](https://www.npmjs.com/package/@types/supertest) - 6.0.3
- [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint) - 8.54.0
- [@vitest/coverage-v8](https://vitest.dev/) - 4.0.18
- [@vitest/ui](https://vitest.dev/) - 4.0.18
- [coveralls](https://coveralls.io/) - 3.1.1
- [dotenv](https://www.dotenv.org/) - 17.2.3
- [eslint](https://eslint.org/) - 9.39.2
- [eslint-config-prettier](https://www.npmjs.com/package/eslint-config-prettier) - 10.1.8
- [eslint-import-resolver-typescript](https://github.com/import-js/eslint-plugin-import) - 4.4.4
- [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import) - 2.32.0
- [eslint-plugin-prettier](https://www.npmjs.com/package/eslint-plugin-prettier) - 5.5.5
- [eslint-plugin-promise](https://www.npmjs.com/package/eslint-plugin-promise) - 7.2.1
- [eslint-plugin-vitest-globals](https://www.npmjs.com/package/eslint-plugin-vitest-globals) - 1.5.0
- [globals](https://github.com/sindresorhus/globals) - 17.1.0
- [husky](https://github.com/typicode/husky) - 9.1.7
- [kleur](https://github.com/lukeed/kleur) - 4.1.5
- [lint-staged](https://github.com/okonet/lint-staged) - 16.2.7
- [npm-check](https://github.com/dylang/npm-check) - 6.0.1
- [openapi-types](https://github.com/kogosoftwarellc/open-api) - 12.1.3
- [prisma](https://www.prisma.io/) - 7.3.0
- [semantic-release](https://github.com/semantic-release/semantic-release) - 25.0.2
- [supertest](https://github.com/visionmedia/supertest) - 7.2.2
- [tsup](https://github.com/egoist/tsup) - 8.5.1
- [tsx](https://github.com/esbuild-kit/tsx) - 4.21.0
- [typescript](https://www.typescriptlang.org/) - 5.9.3
- [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) - 8.54.0
- [vite-tsconfig-paths](https://github.com/aleclarson/vite-tsconfig-paths) - 6.0.5
- [vitest](https://vitest.dev/) - 4.0.18
- [vitest-mock-extended](https://github.com/ericalli/vitest-mock-extended) - 3.1.0

## Getting Started
This section describes the main **libraries** and **tools** used in the project, separated between development and production dependencies.

### Prerequisites
In addition to **Node.js**, some other tools are required to run this project:

- [Node.js](https://nodejs.org/) - 24.14.1
- [Docker](https://www.docker.com/) - 28.5.1

### Optionals
You can also install this toolkit for a better experience:

- [Cursor](https://cursor.com/changelog/1-7) - 1.7
- [Insomnia](https://insomnia.rest/) - 11.6.1

### Env Variables
For security reasons, the `.env` file is not versioned, meaning it is not sent to the GitHub repository.

So you can copy and paste the `.env.example` file and rename it to `.env`. Then, you need to configure the environment variables.

You must also setup a `.env.test` to run the tests.

All variables can be configured according to your preferences.

I recommend that you leave the `DATABASE_URL` variable as it is in the example, as it refers to the other database configuration environment variables.

The only point of attention is regarding `JWT_PRIVATE_KEY` and `JWT_PUBLIC_KEY`. The JWT adapter reads the base64 values of these two environment variables. That is, in this case, there is no reading of the .pem files to obtain the keys.

To generate a pair of keys on MacOS, you can use these commands:

```bash
# generate private key
openssl genpkey -algorithm RSA -out private-key.pem -pkeyopt rsa_keygen_bits:2048
```

```bash
# generate public key
openssl rsa -pubout -in private-key.pem -out public-test-key.pem
```

Now it is necessary to transform the .pem files into base64. To do this on MacOS, you can follow these steps:

```bash
# transform private key in base64
openssl base64 -in private-key.pem -out private-key.txt
```

```bash
# transform public key in base64
openssl base64 -in public-key.pem -out public-key.txt
```

Now, the values obtained in the .txt files are the private and public keys in base64. These are the values that you must set for `JWT_PRIVATE_KEY` and `JWT_PUBLIC_KEY`.

### Preparing
Install the dependencies with your favorite package manager (npm, yarn, or pnpm). In the example below, the default package manager for Node.js, npm, will be used:

```bash
npm install
```

### Run Tests
To run unit tests (*.spec.ts):
```bash
npm run test
```

To run unit tests (*.spec.ts) in watch mode:
```bash
npm run test:watch
```

To run e2e tests (*.e2e.ts):
```bash
npm run test:e2e
```

To run e2e tests (*.e2e.ts) in watch mode:
```bash
npm run test:e2e:watch
```

To run all tests unit and e2e tests (*.spec.ts and *.e2e.ts)
```bash
npm run test:ci
```

### Start Server
If database container is running, you can run:
```bash
npm run start:dev
```

Or you can use wizard:
```bash
npm run wizard
```

And choose option 5!

## Contact
<div align="center">
  <a href="https://buymeacoffee.com/matheuspleal">
    <img src="https://img.shields.io/badge/-Buy%20Me%20a%20Coffee-3442E8?style=flat-square&logo=Starbucks&logoColor=F0EFEB" alt="Buy Me a Coffee Badge">
  </a>
  <a href="https://www.youtube.com/@matheuspleal">
    <img src="https://img.shields.io/badge/-YouTube-3442E8?style=flat-square&logo=YouTube&logoColor=F0EFEB" alt="YouTube Badge">
  </a>
  <a href="https://www.linkedin.com/in/matheuspleal/">
    <img src="https://img.shields.io/badge/-LinkedIn-3442E8?style=flat-square&logo=Linkedin&logoColor=F0EFEB" alt="LinkedIn Badge">
  </a>
    <a href="https://www.instagram.com/matheuspleal/">
    <img src="https://img.shields.io/badge/-Instagram-3442E8?style=flat-square&logo=Instagram&logoColor=F0EFEB" alt="Instagram Badge">
  </a>
</div>

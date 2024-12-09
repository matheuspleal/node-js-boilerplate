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
        <li><a href="#wizard">Wizard</a></li>
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
The project's goal is to demonstrate how it is possible to develop software in a decoupled manner. Thus, the example used in this boilerplate is extremely simple and can be divided into two main sets of features: **Authentication** and **Persons**.

The **Authentication** functionality allows **Sign Up** in the system and ensures that the **access token** is generated (**Sign In**) so that **Users** resources, which are protected, can be accessed.

The **Persons** functionality allows an authenticated user to **Fetch Persons** in a paginated way and **Get Person By Id**.

Interaction with the API can be done in two ways, through the **REST API** or the **GraphQL API**.

## Libraries And Tools
This section describes the main **libraries** and **tools** used in the project, separated between development and production dependencies.

### Dependencies
- [@apollo/server](https://github.com/apollographql/apollo-server) - 4.11.2
- [@as-integrations/fastify](https://www.npmjs.com/package/@as-integrations/fastify) - 2.1.1
- [@fastify/cors](https://github.com/fastify/fastify-cors) - 9.0.1
- [@prisma/client](https://github.com/prisma/prisma) - 6.0.1
- [@scalar/fastify-api-reference](https://github.com/scalar/scalar?tab=readme-ov-file#fastify) - 1.25.76
- [@scalar/themes](https://github.com/scalar/scalar#themes) - 0.9.54
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) - 2.4.3
- [fastify](https://github.com/fastify/fastifyp) - 4.27.0
- [graphql](https://github.com/graphql/graphql-js) - 16.9.0
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - 9.0.2
- [pg](https://github.com/brianc/node-postgres) - 8.13.1
- [zx](https://github.com/google/zx) - 8.2.4

### Dev Dependencies
- [@commitlint/cli](https://github.com/conventional-changelog/commitlint) - 19.6.0
- [@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint) - 19.6.0
- [@faker-js/faker](https://fakerjs.dev/) - 9.3.0
- [@semantic-release/changelog](https://www.npmjs.com/package/@semantic-release/changelog) - 6.0.3
- [@semantic-release/commit-analizer](https://www.npmjs.com/package/@semantic-release/commit-analizer) - 13.0.0
- [@semantic-release/git](https://www.npmjs.com/package/@semantic-release/git) - 10.0.1
- [@semantic-release/github](https://www.npmjs.com/package/@semantic-release/github) - 11.0.1
- [@semantic-release/release-notes-generator](https://www.npmjs.com/package/@semantic-release/release-notes-generator) - 14.0.1
- [@types/jsonwebtoken](https://www.npmjs.com/package/@types/jsonwebtoken) - 9.0.7
- [@types/node](https://www.npmjs.com/package/@types/node) - 22.10.1
- [@types/pg](https://www.npmjs.com/package/@types/pg) - 8.11.10
- [@types/supertest](https://www.npmjs.com/package/@types/supertest) - 6.0.2
- [@vitest/coverage-v8](https://vitest.dev/) - 2.1.8
- [@vitest/ui](https://vitest.dev/) - 2.1.8
- [coveralls](https://coveralls.io/) - 3.1.1
- [dotenv](https://www.dotenv.org/) - 16.4.7
- [eslint](https://eslint.org/) - 8.57.0
- [eslint-config-love](https://www.npmjs.com/package/eslint-config-love) - "47.0.0",
- [eslint-config-prettier](https://www.npmjs.com/package/eslint-config-prettier) - "9.1.0",
- [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import) - "2.31.0",
- [eslint-plugin-prettier](https://www.npmjs.com/package/eslint-plugin-prettier) - "5.2.1",
- [eslint-plugin-promise](https://www.npmjs.com/package/eslint-plugin-promise) - "6.1.1",
- [eslint-plugin-vitest-globals](https://www.npmjs.com/package/eslint-plugin-vitest-globals) - "1.5.0",
- [husky](https://github.com/typicode/husky) - 9.1.7
- [kleur](https://github.com/lukeed/kleur) - 4.1.5
- [lint-staged](https://github.com/okonet/lint-staged) - 15.2.10
- [npm-check](https://github.com/dylang/npm-check) - 6.0.1
- [openapi-types](https://github.com/kogosoftwarellc/open-api) - 12.1.3
- [prisma](https://www.prisma.io/) - 5.14.0
- [semantic-release](https://github.com/semantic-release/semantic-release) - 23.1.1
- [supertest](https://github.com/visionmedia/supertest) - 7.0.0
- [tsup](https://github.com/egoist/tsup) - 8.3.5
- [tsx](https://github.com/esbuild-kit/tsx) - 4.19.2
- [typescript](https://www.typescriptlang.org/) - 5.7.2
- [vite-tsconfig-paths](https://github.com/aleclarson/vite-tsconfig-paths) - 5.1.4
- [vitest](https://vitest.dev/) - 2.1.8
- [vitest-mock-extended](https://github.com/ericalli/vitest-mock-extended) - 2.0.2

## Getting Started
This section describes the main **libraries** and **tools** used in the project, separated between development and production dependencies.

### Prerequisites
In addition to **Node.js**, some other tools are required to run this project:

- [Node.js](https://nodejs.org/) - 20.13.1
- [Docker](https://www.docker.com/) - 25.0.5
- [Insomnia](https://insomnia.rest/) - 9.2.0

### Optionals
You can also install this toolkit for a better experience:

- [VS Code](https://code.visualstudio.com/) - 1.89
- [Insomnia](https://insomnia.rest/) - 9.2.0

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

### Wizard
The wizard is a simple CLI contained in the project, developed with Google ZX to assist developers with various tasks. To run it, you can use one of the following scripts:

```bash
# Without logs
npm run wizard
```

```bash
# With logs
npm run wizard:logs
```
Now just choose one of the options below and wait for the magic to happen!

![Wizard](https://i.imgur.com/k5ji5C8.gif)

### Run Tests
To run unit tests (*.spec.ts):
```bash
npm run test
```

To run unit tests (*.spec.ts) in watch mode:
```bash
npm run test:watch
```

To run e2e tests (*.test.ts):
```bash
npm run test:e2e
```

To run e2e tests (*.test.ts) in watch mode:
```bash
npm run test:e2e:watch
```

To run all tests unit and e2e tests (*.spec.ts and *.test.ts)
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

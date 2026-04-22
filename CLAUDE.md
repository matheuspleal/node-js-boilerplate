# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

| Task | Command |
|------|---------|
| Build | `pnpm build` |
| Dev server | `pnpm start:dev` |
| Lint | `pnpm lint` |
| Lint fix | `pnpm lint:fix` |
| Run all tests | `pnpm test` |
| Run single test | `pnpm test -- src/path/to/file.spec.ts` |
| Watch tests | `pnpm test:watch` |
| E2E tests | `pnpm test:e2e` (starts Docker DB) |
| CI tests + coverage | `pnpm test:ci` |
| Prisma migrations (dev) | `pnpm migrate:dev` |
| Prisma Studio | `pnpm prisma:studio` |
| Docker up | `make up` |
| Docker down | `make down` |
| Full reset | `make fresh` |

Package manager is **pnpm**. Node.js 24, TypeScript 5.9, ES2022 target, ESM modules.

## Architecture

Clean Architecture + DDD with four layers, each module in `src/modules/<name>/` mirrors this structure:

- **Domain** (`domain/`) — Entities, Aggregate Roots, Value Objects, Domain Events, Specifications, domain errors. Pure logic, no dependencies.
- **Application** (`application/`) — Use cases, repository/gateway interfaces (contracts), mappers, subscribers.
- **Infrastructure** (`infra/`) — Prisma repository implementations, gateway implementations (JWT, Bcrypt).
- **Presentation** (`presentation/`) — Controllers (extend `HttpController`), presenters, validators.

Cross-cutting code lives in `src/core/` with the same layer breakdown. Entry point and wiring live in `src/main/`.

Current bounded contexts: `users` (authentication + profile + domain events) and `notification` (welcome notification triggered by `UserCreatedEvent`).

### Key Patterns

- **Either monad** (`src/core/shared/either/`) — All domain/application operations return `Either<Error, Success>` instead of throwing. Use `left()` for errors, `right()` for success, `combine()` to merge multiple results.
- **Manual DI via factories** (`src/main/factories/`) — No DI container. Factory functions like `makeSignUpController()` wire dependencies by hand.
- **Entity/VO creation** — Static `create()` for validated construction (returns Either), static `reconstitute()` for hydration from persistence (no validation).
- **Mapper pattern** — Each entity has a mapper with `toDomain()`, `toPersistence()`, `toDTO()` methods. Mappers are standalone classes (no base class).
- **Aggregate Root + Domain Events** (`src/core/domain/aggregate-root.ts`, `src/core/domain/events/domain-events.ts`) — Aggregates call `protected addDomainEvent(event)`, which auto-marks the aggregate for dispatch. Repositories call `DomainEvents.dispatchEventsForAggregate(aggregate.id)` after persisting. `dispatch` is async; subscribers run fire-and-forget (subscriber failure does not abort the emitting aggregate).
- **Subscribers** (`src/modules/<module>/application/subscribers/`) — Implement `DomainEventHandler<Event>` with `handle(event)`. Registered via `setupSubscriptions()` during `appSetup()` → `subscribersSetup()`.
- **Specifications** (`src/core/domain/specifications/specification.ts`, `src/modules/<module>/domain/specifications/`) — Composable domain rules. Use `.and()`, `.or()`, `.not()` to combine.
- **WatchedList** (`src/core/domain/watched-list.ts`) — Tracks `added`/`removed` items for incremental collection updates in aggregates.
- **Prisma singleton** — Repositories extend `BasePrismaRepository` which provides `this.prisma` via `PrismaConnectionManager.getInstance()`.
- **Controller validation** — Override `buildValidators()` using `BuilderValidator` fluent API (`required()`, `isValidUUID()`, `isValidPassword()`, `isEmail()`, `isValidDate()`), then implement `perform()` for the handler logic.
- **Adapters** — `fastifyRouterAdapter` for REST routes, `apolloServerResolverAdapter` for GraphQL resolvers.
- **Graceful shutdown** (`src/main/helpers/graceful-shutdown.helper.ts`) — `SIGTERM`/`SIGINT` drain Fastify and disconnect Prisma before `process.exit`. Timeout via `SERVER_SHUTDOWN_TIMEOUT_IN_MS` (default 10s).

### Stack

Fastify 5 (REST) + Apollo Server 5 (GraphQL), PostgreSQL via Prisma ORM, Vitest for testing.

## Naming Conventions

- Files: `kebab-case` with suffix indicating type — `.entity.ts`, `.vo.ts`, `.use-case.ts`, `.controller.ts`, `.repository.ts`, `.mapper.ts`, `.error.ts`, `.helper.ts`
- Tests: `.spec.ts` (not `.test.ts`)
- Classes: `UserEntity`, `EmailVO`, `SignUpUseCase`, `SignUpController`, `InvalidEmailError`
- Factory functions: `make<Name>()` (e.g., `makeSignUpController`)
- Path aliases: `@/*` maps to `src/*`, `#/*` maps to `test/*`

## Testing

- Vitest with `vitest-mock-extended` for mocking and `@faker-js/faker` for test data.
- Three configs: `vitest.config.ts` (unit), `vitest-ci.config.ts` (CI + coverage), `vitest-e2e.config.ts` (E2E with real DB).
- E2E tests require Docker PostgreSQL (`pnpm setup:test`).
- Test utilities live under `test/` directory.

---
current_phase: 04-customers-module
current_plan: 04-03
status: in-progress
last_completed_phase: 03-payment-method-module
last_updated: 2026-02-05
context_files:
  - .planning/phases/02-services-module/02-01-PLAN.md
  - .planning/phases/02-services-module/02-02-PLAN.md
  - .planning/phases/02-services-module/02-03-PLAN.md
  - .planning/phases/02-services-module/02-04-PLAN.md
  - .planning/phases/02-services-module/02-05-PLAN.md
  - .planning/phases/03-payment-method-module/03-01-PLAN.md
  - .planning/phases/03-payment-method-module/03-02-PLAN.md
  - .planning/phases/03-payment-method-module/03-03-PLAN.md
  - .planning/phases/03-payment-method-module/03-04-PLAN.md
  - .planning/phases/03-payment-method-module/03-05-PLAN.md
  - .planning/phases/04-customers-module/04-01-PLAN.md
  - .planning/phases/04-customers-module/04-02-PLAN.md
  - .planning/phases/04-customers-module/04-03-PLAN.md
---

# Project State

## Current Position
**Phase:** 04 of 4 (Customers Module)
**Plan:** 03 of 5 Completed
**Status:** In progress
**Last activity:** 2026-02-05 - Completed 04-03-PLAN.md (Customer Service)
**Next Phase:** None

**Progress:** 89%
[█████████░]

## Accumulated Context

### Roadmap Evolution
- Phase 04 added: Implementation of the customers module endpoints specified in PLAN.md

## Decisions Made

| Decision | Context |
| :--- | :--- |
| **Prisma Raw Query** | Used for `lowStock` filter due to column comparison limitation in standard Prisma. |
| **Decimal to Number** | Converted DB Decimals to JS Numbers in Repository for domain simplicity. |
| **Repository Extension** | Added `getByName` to `IProductRepository` for duplicate checking. |
| **CategoryMapper Fix** | Fixed type error in mapper to allow build. |
| **Controller Validation** | Added explicit ID checks in ProductController to satisfy strict typing. |
| **Router Binding** | Skipped `.bind()` in ProductRouter as Controller uses arrow functions. |
| **Service Entity Schema-first** | Used actual Prisma schema naming (price, durationMinutes, status) for Service entity instead of plan's suggestions. |
| **Service Price Type** | Used number type for Service.price following Product module's decimal-to-number pattern. |
| **Service Field Naming Alignment** | Service DTOs use actual entity field names (status, durationMinutes, price) to maintain consistency with database schema. |
| **Service Default Limit** | Set default pagination limit to 20 for services (vs 10 for products) since services are typically fewer in number. |
| **Service Global Scope** | Services are global/shared across system (no storeId) unlike Products which are scoped to categories. Repository implemented without store filtering. |
| **Service Search OR Logic** | Search filters match name OR description fields for comprehensive results. |
| **Repository Extension for Soft-Delete Restoration** | Added restore() and getByName() methods to IServiceRepository to support service layer's soft-delete restoration logic pattern (consistent with CategoryService). |
| **PUT vs PATCH for Service Updates** | Used PUT for service updates following Product module pattern for consistency across REST APIs. |
| **Container-based DI** | Extended Container pattern for service dependencies rather than direct instantiation (maintains architectural consistency). |
| **Email validation with empty string fallback** | PaymentMethod email field uses `.email().or(z.literal(''))` pattern to allow empty strings while validating email format when present. |
| **Currency as nullable enum** | PaymentMethod currency uses `z.nativeEnum(Currency).nullable().optional()` to maintain type safety while allowing flexibility. |
| **Currency type casting in mapper** | Cast Prisma Currency to custom Currency type using 'as Currency \| null' to maintain type safety while allowing entity to use custom enum. |
| **getByName includeDeleted flag** | Add includeDeleted boolean parameter (default: false) to control deletedAt filtering for soft-deleted record restoration. |
| **Soft-delete restoration in PaymentMethod create** | Restore deleted record and update with new data when creating payment method with existing name. |
| **PaymentMethod mapper naming** | Use toPublic() and toPublicList() following ServiceMapper pattern for consistency. |
| **Default isActive for PaymentMethods** | Default to true (active) for new payment methods when not explicitly provided. |
| **Arrow function methods in PaymentMethod Controller** | Use arrow functions for automatic this binding, eliminating need for .bind() calls in router. |
| **Explicit ID validation in PaymentMethod controller** | Validate ID param explicitly in get/update/delete methods for early feedback. |
| **ValidatedQuery from res.locals** | Read filters from res.locals.validatedQuery populated by ValidateQueryParams middleware. |
| **Container pattern consistency** | Follow existing pattern: repository → service → route registration for PaymentMethod module to maintain consistency with Category, Product, Service modules. |
| **Schema-First Types** | Used `z.infer` to generate Create/Update types in schema file, then re-exported in DTO file. |
| **Entity Matching** | `Customer` entity properties strictly match the Prisma `Customer` model. |
| **Optional Fields** | `idNumber` and `phone` are optional/nullable in both Schema and Entity. |
| **Direct Filter Type Usage** | Used `CustomerFiltersType` (from schema) directly in Repository and calculated `skip` locally in CustomerRepository. |
| **includeDeleted Flag** | Added optional `includeDeleted` parameter to `getByIdNumber` in CustomerRepository for soft-delete handling. |
| **Error Handling** | Added specific business errors for better client feedback. |
| **Restore Logic** | Implemented `restore` in `create` method if customer exists but is soft-deleted. |
| **Mapper Naming** | Used `toPublic` / `toPublicList` conventions. |

## Session Continuity
**Last session:** 2026-02-05
**Stopped at:** Completed 04-03-PLAN.md (Customer Service)
**Resume file:** None
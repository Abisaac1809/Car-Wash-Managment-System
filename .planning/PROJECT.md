# Car Wash Management System

## What This Is

A management system for car wash operations that handles products, services, inventory, orders, sales, and customers. Currently implementing the product catalog module to enable inventory management and sales tracking following Clean Architecture principles with TypeScript, Express, and Prisma.

## Core Value

Enable car wash operators to track inventory and manage sales accurately through a well-structured product catalog with proper stock management and category organization.

## Requirements

### Validated

- ✓ Clean Architecture foundation with dependency injection — existing
- ✓ Category CRUD module with pagination and filtering — existing
- ✓ Database schema with all models (Prisma + PostgreSQL) — existing
- ✓ Soft delete strategy across all entities — existing
- ✓ Request validation with Zod schemas — existing
- ✓ Error handling system (BusinessError hierarchy) — existing
- ✓ HTTP logging middleware — existing
- ✓ DTO pattern with mappers (Entity → PublicDTO) — existing

### Active

- [ ] Product CRUD endpoints (GET list, GET by ID, POST create, PUT update, DELETE soft-delete)
- [ ] Product filtering (categoryId, lowStock, search, isForSale, status, pagination)
- [ ] Stock management rules (editable on creation, then locked to adjustments/sales)
- [ ] Category deletion validation (prevent delete if products exist)
- [ ] Low stock detection filter (stock < minStock)
- [ ] Product sale type distinction (isForSale: true for customers, false for services)

### Out of Scope

- Inventory adjustment endpoints — deferred to next phase
- Sales and order processing — separate modules
- Authentication and authorization — future phase
- Real-time stock alerts — v2 feature
- Batch product imports — not needed for MVP

## Context

**Existing Architecture:**
- 12-step Clean Architecture module pattern established in Category module
- Layers: Router → Controller → Service → Repository → Prisma
- Category module serves as reference implementation for Product module
- All database models already defined in Prisma schema

**Technical Environment:**
- Node.js + Express + TypeScript + Prisma + PostgreSQL
- Zod for runtime validation
- Soft deletes with deletedAt timestamps
- Page-based pagination in API, offset-based in repositories

**Business Context:**
- Car wash uses products for two purposes: direct sales to customers (isForSale=true) and internal use for services (isForSale=false)
- Stock tracking critical for reordering supplies (lowStock alerts when stock < minStock)
- Products belong to categories for organization and reporting

## Constraints

- **Architecture**: Must follow existing 12-step module pattern from Category reference — ensures consistency and maintainability
- **Tech Stack**: TypeScript + Express + Prisma (already established) — no new dependencies
- **Data Integrity**: All deletes are soft deletes with deletedAt — preserves audit trail
- **Stock Immutability**: Stock field read-only after creation (except via adjustments/sales) — prevents data corruption
- **Category Protection**: Cannot delete categories with active products — maintains referential integrity

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Stock editable only on creation | Prevents manual stock manipulation; enforces audit trail through adjustments/sales | — Pending |
| Block category deletion if products exist | Preserves referential integrity; prevents orphaned products | — Pending |
| Low stock = stock < minStock | Simple comparison enables reorder alerts | — Pending |
| isForSale filter includes both when unspecified | Flexible querying; explicit filtering when needed | — Pending |

---
*Last updated: 2026-02-04 after initialization*

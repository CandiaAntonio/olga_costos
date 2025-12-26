# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Web application for jewelry production cost tracking - **Lebedeva Jewelry**. Built with Next.js 14, Prisma, and SQLite. Replaces the original Excel-based costing system.

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Database**: SQLite with Prisma 5 ORM
- **Styling**: Tailwind CSS 4 + Lebedeva branding (Cormorant/Comfortaa fonts)
- **Icons**: Lucide React

## Key Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run db:seed      # Seed database with initial data
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
```

## Project Structure

```
src/
├── app/(dashboard)/     # Dashboard pages (piezas, inventario, costos-fijos, ventas, configuracion)
├── components/          # UI components (layout, ui)
├── lib/
│   ├── db/              # Prisma client
│   ├── calculations/    # Business logic (PCG, prices, profits)
│   └── utils.ts         # Utilities (formatCOP, cn)
prisma/
├── schema.prisma        # Database models
└── seed.ts              # Initial data migration
```

## Core Business Logic

Located in `src/lib/calculations/index.ts`:

- **calcularPCG()**: Price Cost per Gram = (Fixed Costs + Depreciation) / Monthly Grams
- **calcularPrecios()**: Suggested price with margin and tax
- **calcularGanancia()**: Profit calculation (50% split if using father's metal)
- **generarCodigoPieza()**: Unique piece code generator

## Database Models

Key models in `prisma/schema.prisma`:
- **Pieza**: Jewelry pieces with costs, prices, and production stages
- **TipoPiedra**: Stone types with USD prices
- **CostoFijo**: Monthly fixed costs
- **Depreciacion**: Tool/office depreciation
- **ConfiguracionGlobal**: Exchange rate (4000 COP/USD), tax (19%), margin (15%)

## Original Data

The `costos_olga.xlsx` file contains the original Excel data that was migrated:
- 15 stone types with prices
- 14 fixed costs
- 2 depreciation items
- Production cost formulas

## Production Workflow (8 Stages)

1. Diseño (Design)
2. Impresión 3D (3D Printing)
3. Fundición (Casting)
4. Preparación Esmaltado (Enamel Prep)
5. Esmaltado (Enameling)
6. Acabado (Finishing)
7. Engaste de Piedras (Stone Setting)
8. Pulido (Polishing)

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains cost tracking data for a jewelry production business. The main data file is `costos_olga.xlsx`, an Excel workbook with production cost calculations in Spanish.

## Data Structure

The Excel file contains four sheets:

1. **Costos Indirectos y Fijos** - Fixed/indirect costs (utilities, rent, tools depreciation, packaging, silver prices, etc.)
2. **Costo Directos** - Direct costs per jewelry piece including:
   - Piece weight in grams
   - Stone types and quantities (diamonds, emeralds, rubies, sapphires, etc.)
   - Enameling costs
   - Chain costs
   - Pricing in COP and USD
3. **Costos Total** - Summary of total production costs
4. **Sheet4** - Metal weight calculations (purchase vs. output weight)

## Key Formulas and References

- Exchange rate (Tipo de Cambio) is stored in `'Costo Directos'!$S$1` (currently 4000 COP/USD)
- Tax rate (Impuesto) is 19% stored in `'Costo Directos'!$S$3`
- Stone prices are in a lookup table at `$U$2:$V$17` in the Costo Directos sheet
- PCG (cost per gram) references indirect costs from `'Costos Indirectos y Fijos'!F22`

## Working with This Data

To read the Excel file programmatically:
```python
import openpyxl
wb = openpyxl.load_workbook('costos_olga.xlsx')
```

Note: Text encoding may show mojibake for Spanish characters (ñ, í, ó, etc.) when reading raw values.

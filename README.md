# Power BI Portfolio Project: Retail Revenue and Customer Insights

This project is a complete Power BI portfolio case study for a fictional Canadian outdoor retail brand. It includes a generated star-schema dataset, Power Query transformation scripts, DAX measures, SQL validation queries, a report build guide, and documentation you can publish with the final `.pbix`.

## Business Brief

The executive team wants a dashboard that explains revenue performance, margin quality, return behavior, and inventory pressure across channels, regions, products, customers, and campaigns.

Primary questions:

1. Which channels, regions, and product categories are driving revenue and margin?
2. Are discounts improving sales or eroding profitability?
3. Where are returns concentrated, and how much revenue is lost to returns?
4. Which customer segments have the strongest repeat-purchase behavior?
5. Which products and stores need inventory attention?

## Project Structure

```text
powerbi-portfolio-project/
  data/                         CSV source tables and dataset summary
  dax/                          Reusable DAX measures
  docs/                         Data dictionary, model design, and report blueprint
  powerquery/                   Power Query M scripts for importing and typing CSVs
  sql/                          SQL schema and validation queries
  assets/                       Power BI theme file
  scripts/                      Synthetic data generator
```

## Dataset

The data is synthetic but designed to behave like a realistic retail analytics model.

| Table | Grain | Purpose |
| --- | --- | --- |
| `fact_sales` | One row per order line | Revenue, cost, discount, channel, campaign, payment method |
| `fact_returns` | One row per returned order line | Return amount, quantity, reason, return timing |
| `fact_inventory_snapshot` | Product-store snapshot | On-hand inventory, reorder point, target stock |
| `dim_date` | One row per calendar date | Calendar attributes for time intelligence |
| `dim_product` | One row per product | Category, subcategory, price, cost, status |
| `dim_customer` | One row per customer | Segment, geography, age band, acquisition channel |
| `dim_store` | One row per store/channel location | Region, province, city, channel type |
| `dim_campaign` | One row per campaign | Campaign type, dates, budget |

Generated volume:

- Sales rows: 5,600
- Return rows: 311
- Date range: 2023-01-01 to 2025-12-31
- Net sales: about CAD 944K

## How To Build In Power BI Desktop

1. Open Power BI Desktop.
2. Use `Get Data > Text/CSV` or Power Query to load every CSV in `data/`.
3. Use the scripts in `powerquery/queries.m` as a reference for column types and calculated cleanup columns.
4. Create the relationships shown in `docs/model_design.md`.
5. Paste the measures from `dax/measures.dax` into a dedicated `Measures` table.
6. Apply the theme from `assets/retail_theme.json`.
7. Build the report pages from `docs/report_blueprint.md`.

Recommended final file name:

```text
Retail Revenue and Customer Insights.pbix
```

## Portfolio Talking Points

- Built a star-schema semantic model with separate fact and dimension tables.
- Used DAX time intelligence for current-period, prior-year, and year-over-year metrics.
- Analyzed revenue, gross margin, returns, discounting, customer segments, and inventory risk.
- Designed dashboard pages around business decisions instead of isolated charts.
- Included SQL checks to validate row counts, revenue totals, return rates, and key KPI logic.

## Suggested Screenshots For Portfolio

After creating the `.pbix`, export or screenshot these pages:

1. Executive Overview
2. Product and Margin Analysis
3. Customer and Channel Insights
4. Returns and Inventory Watchlist

Add those screenshots to `assets/` and reference them from this README before publishing to GitHub.


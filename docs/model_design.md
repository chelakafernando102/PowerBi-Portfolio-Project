# Semantic Model Design

## Model Shape

Use a star schema with dimensions filtering facts. Keep cross-filter direction single unless a specific visual requires otherwise.

## Relationships

| From | To | Cardinality | Direction | Active |
| --- | --- | --- | --- | --- |
| `dim_date[date]` | `fact_sales[order_date]` | 1:* | Single | Yes |
| `dim_date[date]` | `fact_returns[return_date]` | 1:* | Single | No, optional inactive |
| `dim_date[date]` | `fact_inventory_snapshot[snapshot_date]` | 1:* | Single | Yes |
| `dim_product[product_id]` | `fact_sales[product_id]` | 1:* | Single | Yes |
| `dim_product[product_id]` | `fact_inventory_snapshot[product_id]` | 1:* | Single | Yes |
| `dim_customer[customer_id]` | `fact_sales[customer_id]` | 1:* | Single | Yes |
| `dim_store[store_id]` | `fact_sales[store_id]` | 1:* | Single | Yes |
| `dim_store[store_id]` | `fact_inventory_snapshot[store_id]` | 1:* | Single | Yes |
| `dim_campaign[campaign_id]` | `fact_sales[campaign_id]` | 1:* | Single | Yes |
| `fact_sales[order_id]` | `fact_returns[order_id]` | 1:* | Single | Yes |

## Recommended Formatting

| Field or Measure | Format |
| --- | --- |
| Sales, cost, profit, return amount, budget | Currency, CAD, 0 decimals on visuals |
| Percent measures | Percentage, 1 decimal |
| Quantity and order counts | Whole number |
| Dates | `yyyy-mm-dd` in model, friendly labels in visuals |

## Modeling Notes

- Hide technical key columns after relationships are created.
- Sort `dim_date[month_name]` by `dim_date[month_number]`.
- Keep measures in a dedicated `Measures` table.
- Use `dim_date` as the date table in Power BI.
- Use `Net Sales After Returns` for executive profit views when return impact should be included.
- Keep the `dim_date` to `fact_returns` relationship inactive if you also relate returns to sales by `order_id`; this avoids an ambiguous filter path. Return metrics will follow the sale date by default through `fact_sales`.

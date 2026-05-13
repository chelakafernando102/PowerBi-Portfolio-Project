# Data Dictionary

## fact_sales

| Column | Description |
| --- | --- |
| `order_id` | Unique order line identifier |
| `order_date` | Date of sale |
| `customer_id` | Customer key |
| `product_id` | Product key |
| `store_id` | Store or ecommerce key |
| `campaign_id` | Campaign key, `C000` for organic or no campaign |
| `sales_channel` | Store, Online, Click & Collect, or Associate Order |
| `quantity` | Units sold |
| `unit_price` | Price after discount |
| `discount_pct` | Discount percentage applied |
| `gross_sales` | List price multiplied by quantity |
| `net_sales` | Discounted price multiplied by quantity |
| `total_cost` | Unit cost multiplied by quantity |
| `shipping_fee` | Shipping fee charged for online orders |
| `payment_method` | Payment type |

## fact_returns

| Column | Description |
| --- | --- |
| `return_id` | Unique return identifier |
| `order_id` | Related sales order |
| `return_date` | Date of return |
| `returned_quantity` | Units returned |
| `return_amount` | Returned revenue |
| `return_reason` | Reason selected during return |

## fact_inventory_snapshot

| Column | Description |
| --- | --- |
| `snapshot_date` | Inventory snapshot date |
| `store_id` | Store key |
| `product_id` | Product key |
| `on_hand_units` | Units available |
| `reorder_point` | Minimum desired stock before replenishment |
| `target_stock_units` | Target stock level |

## Dimensions

`dim_date` contains calendar attributes for time intelligence.

`dim_product` contains product category, subcategory, price, cost, launch date, and status.

`dim_customer` contains segment, province, age band, signup date, and acquisition channel.

`dim_store` contains region, province, city, and channel type.

`dim_campaign` contains campaign name, type, dates, and budget.


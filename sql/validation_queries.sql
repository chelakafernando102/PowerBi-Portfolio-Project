-- Use these queries to validate model totals before or after loading into Power BI.

-- Row counts by table.
SELECT 'fact_sales' AS table_name, COUNT(*) AS row_count FROM fact_sales
UNION ALL SELECT 'fact_returns', COUNT(*) FROM fact_returns
UNION ALL SELECT 'dim_customer', COUNT(*) FROM dim_customer
UNION ALL SELECT 'dim_product', COUNT(*) FROM dim_product
UNION ALL SELECT 'dim_store', COUNT(*) FROM dim_store
UNION ALL SELECT 'dim_campaign', COUNT(*) FROM dim_campaign
UNION ALL SELECT 'fact_inventory_snapshot', COUNT(*) FROM fact_inventory_snapshot;

-- Executive KPI totals.
SELECT
    COUNT(DISTINCT order_id) AS total_orders,
    SUM(quantity) AS units_sold,
    ROUND(SUM(net_sales), 2) AS net_sales,
    ROUND(SUM(net_sales - total_cost), 2) AS gross_profit,
    ROUND(SUM(net_sales - total_cost) / NULLIF(SUM(net_sales), 0), 4) AS gross_margin_pct
FROM fact_sales;

-- Sales by region and category.
SELECT
    st.region,
    p.category,
    ROUND(SUM(s.net_sales), 2) AS net_sales,
    ROUND(SUM(s.net_sales - s.total_cost), 2) AS gross_profit
FROM fact_sales s
JOIN dim_store st ON st.store_id = s.store_id
JOIN dim_product p ON p.product_id = s.product_id
GROUP BY st.region, p.category
ORDER BY net_sales DESC;

-- Return rate by category.
SELECT
    p.category,
    ROUND(SUM(r.return_amount), 2) AS return_amount,
    ROUND(SUM(s.net_sales), 2) AS net_sales,
    ROUND(SUM(r.return_amount) / NULLIF(SUM(s.net_sales), 0), 4) AS return_rate
FROM fact_returns r
JOIN fact_sales s ON s.order_id = r.order_id
JOIN dim_product p ON p.product_id = s.product_id
GROUP BY p.category
ORDER BY return_rate DESC;

-- Inventory watchlist.
SELECT
    st.store_name,
    p.product_name,
    i.on_hand_units,
    i.reorder_point,
    i.target_stock_units,
    i.target_stock_units - i.on_hand_units AS units_to_target
FROM fact_inventory_snapshot i
JOIN dim_store st ON st.store_id = i.store_id
JOIN dim_product p ON p.product_id = i.product_id
WHERE i.on_hand_units < i.reorder_point
ORDER BY units_to_target DESC;


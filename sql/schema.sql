-- Optional SQL schema for loading the portfolio dataset into a relational database.

CREATE TABLE dim_date (
    date DATE PRIMARY KEY,
    year INTEGER,
    quarter VARCHAR(2),
    month_number INTEGER,
    month_name VARCHAR(3),
    week_number INTEGER,
    day_name VARCHAR(3),
    is_weekend VARCHAR(3)
);

CREATE TABLE dim_store (
    store_id VARCHAR(10) PRIMARY KEY,
    store_name VARCHAR(100),
    region VARCHAR(50),
    province VARCHAR(10),
    city VARCHAR(50),
    channel_type VARCHAR(20),
    opened_date DATE
);

CREATE TABLE dim_product (
    product_id VARCHAR(10) PRIMARY KEY,
    product_name VARCHAR(100),
    category VARCHAR(50),
    subcategory VARCHAR(50),
    list_price DECIMAL(12, 2),
    unit_cost DECIMAL(12, 2),
    launch_date DATE,
    status VARCHAR(20)
);

CREATE TABLE dim_customer (
    customer_id VARCHAR(10) PRIMARY KEY,
    customer_name VARCHAR(100),
    segment VARCHAR(30),
    province VARCHAR(10),
    age_band VARCHAR(10),
    signup_date DATE,
    acquisition_channel VARCHAR(50)
);

CREATE TABLE dim_campaign (
    campaign_id VARCHAR(10) PRIMARY KEY,
    campaign_name VARCHAR(100),
    campaign_type VARCHAR(50),
    start_date DATE,
    end_date DATE,
    budget DECIMAL(12, 2)
);

CREATE TABLE fact_sales (
    order_id VARCHAR(20) PRIMARY KEY,
    order_date DATE,
    customer_id VARCHAR(10),
    product_id VARCHAR(10),
    store_id VARCHAR(10),
    campaign_id VARCHAR(10),
    sales_channel VARCHAR(30),
    quantity INTEGER,
    unit_price DECIMAL(12, 2),
    discount_pct DECIMAL(6, 4),
    gross_sales DECIMAL(12, 2),
    net_sales DECIMAL(12, 2),
    total_cost DECIMAL(12, 2),
    shipping_fee DECIMAL(12, 2),
    payment_method VARCHAR(30),
    FOREIGN KEY (order_date) REFERENCES dim_date(date),
    FOREIGN KEY (customer_id) REFERENCES dim_customer(customer_id),
    FOREIGN KEY (product_id) REFERENCES dim_product(product_id),
    FOREIGN KEY (store_id) REFERENCES dim_store(store_id),
    FOREIGN KEY (campaign_id) REFERENCES dim_campaign(campaign_id)
);

CREATE TABLE fact_returns (
    return_id VARCHAR(20) PRIMARY KEY,
    order_id VARCHAR(20),
    return_date DATE,
    returned_quantity INTEGER,
    return_amount DECIMAL(12, 2),
    return_reason VARCHAR(100),
    FOREIGN KEY (order_id) REFERENCES fact_sales(order_id)
);

CREATE TABLE fact_inventory_snapshot (
    snapshot_date DATE,
    store_id VARCHAR(10),
    product_id VARCHAR(10),
    on_hand_units INTEGER,
    reorder_point INTEGER,
    target_stock_units INTEGER,
    PRIMARY KEY (snapshot_date, store_id, product_id),
    FOREIGN KEY (snapshot_date) REFERENCES dim_date(date),
    FOREIGN KEY (store_id) REFERENCES dim_store(store_id),
    FOREIGN KEY (product_id) REFERENCES dim_product(product_id)
);


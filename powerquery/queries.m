// Power Query M reference script.
// Update SourceFolder to your local project path before pasting into Power Query Advanced Editor.

let
    SourceFolder = "C:\Path\To\powerbi-portfolio-project\data\",

    CsvTable = (fileName as text) as table =>
        let
            Source = Csv.Document(
                File.Contents(SourceFolder & fileName),
                [Delimiter = ",", Columns = null, Encoding = 65001, QuoteStyle = QuoteStyle.Csv]
            ),
            PromotedHeaders = Table.PromoteHeaders(Source, [PromoteAllScalars = true])
        in
            PromotedHeaders,

    DimDate =
        Table.TransformColumnTypes(
            CsvTable("dim_date.csv"),
            {
                {"date", type date},
                {"year", Int64.Type},
                {"quarter", type text},
                {"month_number", Int64.Type},
                {"month_name", type text},
                {"week_number", Int64.Type},
                {"day_name", type text},
                {"is_weekend", type text}
            }
        ),

    DimStore =
        Table.TransformColumnTypes(
            CsvTable("dim_store.csv"),
            {
                {"store_id", type text},
                {"store_name", type text},
                {"region", type text},
                {"province", type text},
                {"city", type text},
                {"channel_type", type text},
                {"opened_date", type date}
            }
        ),

    DimProduct =
        Table.TransformColumnTypes(
            CsvTable("dim_product.csv"),
            {
                {"product_id", type text},
                {"product_name", type text},
                {"category", type text},
                {"subcategory", type text},
                {"list_price", Currency.Type},
                {"unit_cost", Currency.Type},
                {"launch_date", type date},
                {"status", type text}
            }
        ),

    DimCustomer =
        Table.TransformColumnTypes(
            CsvTable("dim_customer.csv"),
            {
                {"customer_id", type text},
                {"customer_name", type text},
                {"segment", type text},
                {"province", type text},
                {"age_band", type text},
                {"signup_date", type date},
                {"acquisition_channel", type text}
            }
        ),

    DimCampaign =
        Table.TransformColumnTypes(
            CsvTable("dim_campaign.csv"),
            {
                {"campaign_id", type text},
                {"campaign_name", type text},
                {"campaign_type", type text},
                {"start_date", type date},
                {"end_date", type date},
                {"budget", Currency.Type}
            }
        ),

    FactSales =
        Table.TransformColumnTypes(
            CsvTable("fact_sales.csv"),
            {
                {"order_id", type text},
                {"order_date", type date},
                {"customer_id", type text},
                {"product_id", type text},
                {"store_id", type text},
                {"campaign_id", type text},
                {"sales_channel", type text},
                {"quantity", Int64.Type},
                {"unit_price", Currency.Type},
                {"discount_pct", Percentage.Type},
                {"gross_sales", Currency.Type},
                {"net_sales", Currency.Type},
                {"total_cost", Currency.Type},
                {"shipping_fee", Currency.Type},
                {"payment_method", type text}
            }
        ),

    FactReturns =
        Table.TransformColumnTypes(
            CsvTable("fact_returns.csv"),
            {
                {"return_id", type text},
                {"order_id", type text},
                {"return_date", type date},
                {"returned_quantity", Int64.Type},
                {"return_amount", Currency.Type},
                {"return_reason", type text}
            }
        ),

    FactInventorySnapshot =
        Table.TransformColumnTypes(
            CsvTable("fact_inventory_snapshot.csv"),
            {
                {"snapshot_date", type date},
                {"store_id", type text},
                {"product_id", type text},
                {"on_hand_units", Int64.Type},
                {"reorder_point", Int64.Type},
                {"target_stock_units", Int64.Type}
            }
        )
in
    [
        dim_date = DimDate,
        dim_store = DimStore,
        dim_product = DimProduct,
        dim_customer = DimCustomer,
        dim_campaign = DimCampaign,
        fact_sales = FactSales,
        fact_returns = FactReturns,
        fact_inventory_snapshot = FactInventorySnapshot
    ]


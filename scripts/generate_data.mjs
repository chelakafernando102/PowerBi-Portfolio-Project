import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.cwd());
const dataDir = path.join(root, "data");
fs.mkdirSync(dataDir, { recursive: true });

let seed = 42;
function rand() {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
}

function pick(items) {
  return items[Math.floor(rand() * items.length)];
}

function weightedPick(items) {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let threshold = rand() * total;
  for (const item of items) {
    threshold -= item.weight;
    if (threshold <= 0) return item.value;
  }
  return items[items.length - 1].value;
}

function normalish(min, max) {
  return min + (rand() + rand() + rand()) / 3 * (max - min);
}

function dateToIso(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date, days) {
  const copy = new Date(date);
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
}

function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const text = String(value);
  if (/[",\n]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

function writeCsv(fileName, rows) {
  const headers = Object.keys(rows[0]);
  const body = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(",")),
  ].join("\n");
  fs.writeFileSync(path.join(dataDir, fileName), `${body}\n`);
}

const stores = [
  { store_id: "S001", store_name: "Toronto Eaton Centre", region: "East", province: "ON", city: "Toronto", channel_type: "Retail", opened_date: "2018-04-10" },
  { store_id: "S002", store_name: "Halifax Waterfront", region: "Atlantic", province: "NS", city: "Halifax", channel_type: "Retail", opened_date: "2019-06-18" },
  { store_id: "S003", store_name: "Vancouver Robson", region: "West", province: "BC", city: "Vancouver", channel_type: "Retail", opened_date: "2017-09-03" },
  { store_id: "S004", store_name: "Calgary Market", region: "Prairies", province: "AB", city: "Calgary", channel_type: "Retail", opened_date: "2020-02-14" },
  { store_id: "S005", store_name: "Montreal Sainte-Catherine", region: "Quebec", province: "QC", city: "Montreal", channel_type: "Retail", opened_date: "2018-11-23" },
  { store_id: "S006", store_name: "Ottawa Rideau", region: "East", province: "ON", city: "Ottawa", channel_type: "Retail", opened_date: "2021-03-19" },
  { store_id: "S007", store_name: "Edmonton Whyte", region: "Prairies", province: "AB", city: "Edmonton", channel_type: "Retail", opened_date: "2021-08-05" },
  { store_id: "S008", store_name: "Online Store", region: "National", province: "NA", city: "Digital", channel_type: "Ecommerce", opened_date: "2016-01-01" },
];

const products = [
  ["P001", "Trail Jacket", "Outerwear", "Apparel", 129, 56],
  ["P002", "Merino Base Layer", "Tops", "Apparel", 74, 28],
  ["P003", "Everyday Hoodie", "Tops", "Apparel", 88, 34],
  ["P004", "Performance Jogger", "Bottoms", "Apparel", 92, 38],
  ["P005", "Packable Rain Shell", "Outerwear", "Apparel", 149, 66],
  ["P006", "Urban Backpack", "Bags", "Accessories", 119, 52],
  ["P007", "Travel Duffel", "Bags", "Accessories", 138, 61],
  ["P008", "Insulated Bottle", "Hydration", "Accessories", 34, 12],
  ["P009", "Trail Socks 3-Pack", "Basics", "Accessories", 24, 8],
  ["P010", "Running Cap", "Headwear", "Accessories", 29, 9],
  ["P011", "All-Weather Boot", "Footwear", "Footwear", 168, 74],
  ["P012", "City Sneaker", "Footwear", "Footwear", 124, 49],
  ["P013", "Hiking Shoe", "Footwear", "Footwear", 146, 63],
  ["P014", "Yoga Mat", "Training", "Equipment", 58, 21],
  ["P015", "Resistance Band Kit", "Training", "Equipment", 39, 13],
  ["P016", "Compact Tent", "Camping", "Equipment", 259, 132],
  ["P017", "Sleeping Pad", "Camping", "Equipment", 112, 48],
  ["P018", "Camp Chair", "Camping", "Equipment", 79, 31],
].map(([product_id, product_name, subcategory, category, list_price, unit_cost]) => ({
  product_id,
  product_name,
  category,
  subcategory,
  list_price,
  unit_cost,
  launch_date: pick(["2021-02-01", "2021-08-15", "2022-03-10", "2022-09-20", "2023-04-05"]),
  status: rand() > 0.08 ? "Active" : "Seasonal",
}));

const campaigns = [
  { campaign_id: "C000", campaign_name: "No Campaign", campaign_type: "Organic", start_date: "2023-01-01", end_date: "2025-12-31", budget: 0 },
  { campaign_id: "C101", campaign_name: "Spring Refresh", campaign_type: "Paid Social", start_date: "2023-03-01", end_date: "2023-04-30", budget: 42000 },
  { campaign_id: "C102", campaign_name: "Summer Trail", campaign_type: "Search", start_date: "2023-06-01", end_date: "2023-07-31", budget: 55000 },
  { campaign_id: "C103", campaign_name: "Holiday Gear Up", campaign_type: "Email", start_date: "2023-11-01", end_date: "2023-12-31", budget: 39000 },
  { campaign_id: "C201", campaign_name: "Member Days", campaign_type: "Email", start_date: "2024-02-01", end_date: "2024-02-29", budget: 18000 },
  { campaign_id: "C202", campaign_name: "Outdoor Season", campaign_type: "Paid Social", start_date: "2024-05-01", end_date: "2024-06-30", budget: 64000 },
  { campaign_id: "C203", campaign_name: "Back to Routine", campaign_type: "Search", start_date: "2024-08-15", end_date: "2024-09-30", budget: 47000 },
  { campaign_id: "C204", campaign_name: "Peak Holiday", campaign_type: "Paid Social", start_date: "2024-11-01", end_date: "2024-12-31", budget: 76000 },
  { campaign_id: "C301", campaign_name: "New Year Movement", campaign_type: "Search", start_date: "2025-01-02", end_date: "2025-02-15", budget: 52000 },
  { campaign_id: "C302", campaign_name: "Spring Layers", campaign_type: "Email", start_date: "2025-03-10", end_date: "2025-04-25", budget: 31000 },
  { campaign_id: "C303", campaign_name: "Adventure Sale", campaign_type: "Paid Social", start_date: "2025-06-01", end_date: "2025-07-20", budget: 69000 },
];

const firstNames = ["Ava", "Liam", "Noah", "Mia", "Ethan", "Sophia", "Lucas", "Amelia", "Mason", "Isla", "Logan", "Olivia", "Jacob", "Ella", "Leo", "Chloe", "Owen", "Grace", "Aria", "Henry"];
const lastNames = ["Singh", "Chen", "Patel", "Brown", "Wilson", "Martin", "Garcia", "Lee", "Taylor", "Anderson", "Thomas", "Moore", "Clark", "Walker", "Hall", "Young"];
const segments = [
  { value: "New", weight: 28 },
  { value: "Active", weight: 42 },
  { value: "Loyal", weight: 22 },
  { value: "At Risk", weight: 8 },
];

const customers = Array.from({ length: 720 }, (_, index) => {
  const signup = addDays(new Date(Date.UTC(2022, 0, 1)), Math.floor(rand() * 1095));
  const province = weightedPick([
    { value: "ON", weight: 34 },
    { value: "BC", weight: 18 },
    { value: "AB", weight: 16 },
    { value: "QC", weight: 17 },
    { value: "NS", weight: 8 },
    { value: "NB", weight: 4 },
    { value: "PE", weight: 3 },
  ]);
  return {
    customer_id: `CU${String(index + 1).padStart(4, "0")}`,
    customer_name: `${pick(firstNames)} ${pick(lastNames)}`,
    segment: weightedPick(segments),
    province,
    age_band: weightedPick([
      { value: "18-24", weight: 12 },
      { value: "25-34", weight: 29 },
      { value: "35-44", weight: 27 },
      { value: "45-54", weight: 19 },
      { value: "55+", weight: 13 },
    ]),
    signup_date: dateToIso(signup),
    acquisition_channel: weightedPick([
      { value: "Organic Search", weight: 26 },
      { value: "Paid Social", weight: 21 },
      { value: "Email", weight: 17 },
      { value: "Referral", weight: 19 },
      { value: "In Store", weight: 17 },
    ]),
  };
});

const start = new Date(Date.UTC(2023, 0, 1));
const end = new Date(Date.UTC(2025, 11, 31));
const days = Math.floor((end - start) / 86400000) + 1;

const dateRows = Array.from({ length: days }, (_, index) => {
  const d = addDays(start, index);
  const month = d.getUTCMonth() + 1;
  const quarter = Math.floor((month - 1) / 3) + 1;
  return {
    date: dateToIso(d),
    year: d.getUTCFullYear(),
    quarter: `Q${quarter}`,
    month_number: month,
    month_name: d.toLocaleString("en-US", { month: "short", timeZone: "UTC" }),
    week_number: Math.ceil((((d - new Date(Date.UTC(d.getUTCFullYear(), 0, 1))) / 86400000) + 1) / 7),
    day_name: d.toLocaleString("en-US", { weekday: "short", timeZone: "UTC" }),
    is_weekend: [0, 6].includes(d.getUTCDay()) ? "Yes" : "No",
  };
});

function campaignForDate(date) {
  const active = campaigns.filter((campaign) => campaign.campaign_id !== "C000" && campaign.start_date <= date && campaign.end_date >= date);
  if (!active.length || rand() > 0.52) return "C000";
  return pick(active).campaign_id;
}

const orders = [];
const returns = [];
let orderNumber = 10000;

for (let i = 0; i < 5600; i++) {
  const orderDate = addDays(start, Math.floor(rand() * days));
  const orderIso = dateToIso(orderDate);
  const product = pick(products);
  const customer = pick(customers);
  const store = weightedPick(stores.map((storeItem) => ({
    value: storeItem,
    weight: storeItem.store_id === "S008" ? 34 : 10,
  })));
  const seasonalBoost = [11, 12].includes(orderDate.getUTCMonth() + 1) ? 1.18 : 1;
  const quantity = Math.max(1, Math.round(normalish(1, product.category === "Accessories" ? 4 : 2) * seasonalBoost));
  const discount = Number(weightedPick([
    { value: 0, weight: 47 },
    { value: 0.05, weight: 18 },
    { value: 0.1, weight: 17 },
    { value: 0.15, weight: 10 },
    { value: 0.2, weight: 6 },
    { value: 0.3, weight: 2 },
  ]).toFixed(2));
  const unitPrice = Number((product.list_price * (1 - discount)).toFixed(2));
  const grossSales = Number((product.list_price * quantity).toFixed(2));
  const netSales = Number((unitPrice * quantity).toFixed(2));
  const totalCost = Number((product.unit_cost * quantity).toFixed(2));
  const campaignId = campaignForDate(orderIso);
  const order = {
    order_id: `O${orderNumber++}`,
    order_date: orderIso,
    customer_id: customer.customer_id,
    product_id: product.product_id,
    store_id: store.store_id,
    campaign_id: campaignId,
    sales_channel: store.channel_type === "Ecommerce" ? "Online" : weightedPick([
      { value: "Store", weight: 74 },
      { value: "Click & Collect", weight: 16 },
      { value: "Associate Order", weight: 10 },
    ]),
    quantity,
    unit_price: unitPrice,
    discount_pct: discount,
    gross_sales: grossSales,
    net_sales: netSales,
    total_cost: totalCost,
    shipping_fee: store.channel_type === "Ecommerce" ? Number(normalish(0, 14).toFixed(2)) : 0,
    payment_method: weightedPick([
      { value: "Credit Card", weight: 48 },
      { value: "Debit", weight: 21 },
      { value: "PayPal", weight: 12 },
      { value: "Apple Pay", weight: 11 },
      { value: "Gift Card", weight: 8 },
    ]),
  };
  orders.push(order);

  const returnRisk = product.category === "Footwear" ? 0.095 : product.category === "Apparel" ? 0.074 : 0.032;
  if (rand() < returnRisk) {
    const returnedQty = Math.max(1, Math.min(quantity, Math.round(normalish(1, quantity))));
    returns.push({
      return_id: `R${String(returns.length + 1).padStart(5, "0")}`,
      order_id: order.order_id,
      return_date: dateToIso(addDays(orderDate, Math.floor(normalish(4, 34)))),
      returned_quantity: returnedQty,
      return_amount: Number((returnedQty * unitPrice).toFixed(2)),
      return_reason: weightedPick([
        { value: "Size/Fit", weight: 34 },
        { value: "Changed Mind", weight: 24 },
        { value: "Damaged", weight: 10 },
        { value: "Late Delivery", weight: 12 },
        { value: "Product Not As Expected", weight: 20 },
      ]),
    });
  }
}

const inventory = [];
for (const store of stores) {
  for (const product of products) {
    const onHand = Math.round(normalish(15, store.store_id === "S008" ? 230 : 92));
    inventory.push({
      snapshot_date: "2025-12-31",
      store_id: store.store_id,
      product_id: product.product_id,
      on_hand_units: onHand,
      reorder_point: Math.round(normalish(10, 35)),
      target_stock_units: Math.round(normalish(45, store.store_id === "S008" ? 180 : 115)),
    });
  }
}

writeCsv("dim_date.csv", dateRows);
writeCsv("dim_store.csv", stores);
writeCsv("dim_product.csv", products);
writeCsv("dim_customer.csv", customers);
writeCsv("dim_campaign.csv", campaigns);
writeCsv("fact_sales.csv", orders);
writeCsv("fact_returns.csv", returns);
writeCsv("fact_inventory_snapshot.csv", inventory);

const summary = {
  generated_at: new Date().toISOString(),
  rows: {
    dim_date: dateRows.length,
    dim_store: stores.length,
    dim_product: products.length,
    dim_customer: customers.length,
    dim_campaign: campaigns.length,
    fact_sales: orders.length,
    fact_returns: returns.length,
    fact_inventory_snapshot: inventory.length,
  },
  net_sales: Number(orders.reduce((sum, order) => sum + order.net_sales, 0).toFixed(2)),
  returns_amount: Number(returns.reduce((sum, item) => sum + item.return_amount, 0).toFixed(2)),
};

fs.writeFileSync(path.join(dataDir, "dataset_summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));

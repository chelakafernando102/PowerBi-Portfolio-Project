import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.cwd());
const dataDir = path.join(root, "data");
const assetsDir = path.join(root, "assets");
fs.mkdirSync(assetsDir, { recursive: true });

function parseCsv(fileName) {
  const text = fs.readFileSync(path.join(dataDir, fileName), "utf8").trim();
  const [headerLine, ...lines] = text.split(/\r?\n/);
  const headers = splitCsvLine(headerLine);
  return lines.map((line) => {
    const values = splitCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });
}

function splitCsvLine(line) {
  const values = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index++) {
    const char = line[index];
    if (char === '"' && line[index + 1] === '"') {
      current += '"';
      index++;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current);
  return values;
}

function money(value, compact = true) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: compact ? 0 : 2,
    notation: compact ? "compact" : "standard",
  }).format(value);
}

function pct(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function sumBy(rows, keyFn, valueFn) {
  const result = new Map();
  for (const row of rows) {
    const key = keyFn(row);
    result.set(key, (result.get(key) ?? 0) + valueFn(row));
  }
  return [...result.entries()].sort((a, b) => b[1] - a[1]);
}

function topLabel(entries) {
  const [label, value] = entries[0];
  return { label, value };
}

function barChart({ title, entries, x, y, width, height, color, maxRows = 5, barHeight = 25, gap = 16 }) {
  const max = Math.max(...entries.map(([, value]) => value));
  const left = 140;
  const chartWidth = width - left - 104;
  const rows = entries.slice(0, maxRows).map(([label, value], index) => {
    const barWidth = Math.max(4, (value / max) * chartWidth);
    const rowY = y + 62 + index * (barHeight + gap);
    return `
      <text x="${x + 18}" y="${rowY + 18}" class="axis">${escapeXml(label)}</text>
      <rect x="${x + left}" y="${rowY}" width="${barWidth.toFixed(1)}" height="${barHeight}" rx="6" fill="${color}" opacity="${0.95 - index * 0.08}"/>
      <text x="${x + width - 18}" y="${rowY + 18}" text-anchor="end" class="small">${money(value)}</text>`;
  }).join("");

  return `
    <g>
      <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="14" class="panel"/>
      <text x="${x + 18}" y="${y + 32}" class="panel-title">${escapeXml(title)}</text>
      ${rows}
    </g>`;
}

function lineChart({ title, entries, x, y, width, height }) {
  const values = entries.map(([, value]) => value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const chartX = x + 46;
  const chartY = y + 64;
  const chartW = width - 76;
  const chartH = height - 104;
  const points = entries.map(([, value], index) => {
    const px = chartX + (index / (entries.length - 1)) * chartW;
    const py = chartY + chartH - ((value - min) / (max - min)) * chartH;
    return [px, py];
  });
  const pathData = points.map(([px, py], index) => `${index === 0 ? "M" : "L"} ${px.toFixed(1)} ${py.toFixed(1)}`).join(" ");
  const areaData = `${pathData} L ${(chartX + chartW).toFixed(1)} ${(chartY + chartH).toFixed(1)} L ${chartX.toFixed(1)} ${(chartY + chartH).toFixed(1)} Z`;
  const grid = [0, 1, 2, 3].map((line) => {
    const gy = chartY + (line / 3) * chartH;
    return `<line x1="${chartX}" y1="${gy}" x2="${chartX + chartW}" y2="${gy}" class="grid"/>`;
  }).join("");

  return `
    <g>
      <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="14" class="panel"/>
      <text x="${x + 18}" y="${y + 32}" class="panel-title">${escapeXml(title)}</text>
      <text x="${x + 18}" y="${y + 54}" class="small">Monthly net sales, 2023-2025</text>
      ${grid}
      <path d="${areaData}" fill="#0F766E" opacity="0.13"/>
      <path d="${pathData}" fill="none" stroke="#0F766E" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>
      <circle cx="${points.at(-1)[0].toFixed(1)}" cy="${points.at(-1)[1].toFixed(1)}" r="6" fill="#0F766E"/>
      <text x="${chartX}" y="${chartY + chartH + 28}" class="axis">Jan 2023</text>
      <text x="${chartX + chartW - 62}" y="${chartY + chartH + 28}" class="axis">Dec 2025</text>
    </g>`;
}

function kpiCard({ label, value, note, x, y, width, accent }) {
  return `
    <g>
      <rect x="${x}" y="${y}" width="${width}" height="104" rx="14" class="panel"/>
      <rect x="${x}" y="${y}" width="6" height="104" rx="3" fill="${accent}"/>
      <text x="${x + 22}" y="${y + 34}" class="kpi-label">${escapeXml(label)}</text>
      <text x="${x + 22}" y="${y + 68}" class="kpi-value">${escapeXml(value)}</text>
      <text x="${x + 22}" y="${y + 90}" class="small">${escapeXml(note)}</text>
    </g>`;
}

const sales = parseCsv("fact_sales.csv");
const returns = parseCsv("fact_returns.csv");
const products = Object.fromEntries(parseCsv("dim_product.csv").map((row) => [row.product_id, row]));
const stores = Object.fromEntries(parseCsv("dim_store.csv").map((row) => [row.store_id, row]));
const customers = Object.fromEntries(parseCsv("dim_customer.csv").map((row) => [row.customer_id, row]));
const inventory = parseCsv("fact_inventory_snapshot.csv");

const enrichedSales = sales.map((row) => ({
  ...row,
  net_sales: Number(row.net_sales),
  gross_sales: Number(row.gross_sales),
  total_cost: Number(row.total_cost),
  quantity: Number(row.quantity),
  product: products[row.product_id],
  store: stores[row.store_id],
  customer: customers[row.customer_id],
}));

const totalSales = enrichedSales.reduce((sum, row) => sum + row.net_sales, 0);
const totalCost = enrichedSales.reduce((sum, row) => sum + row.total_cost, 0);
const grossProfit = totalSales - totalCost;
const returnAmount = returns.reduce((sum, row) => sum + Number(row.return_amount), 0);
const units = enrichedSales.reduce((sum, row) => sum + row.quantity, 0);
const topRegion = topLabel(sumBy(enrichedSales, (row) => row.store.region, (row) => row.net_sales));
const topProduct = topLabel(sumBy(enrichedSales, (row) => row.product.product_name, (row) => row.net_sales));
const categorySales = sumBy(enrichedSales, (row) => row.product.category, (row) => row.net_sales);
const regionSales = sumBy(enrichedSales, (row) => row.store.region, (row) => row.net_sales);
const monthlySales = sumBy(
  enrichedSales,
  (row) => row.order_date.slice(0, 7),
  (row) => row.net_sales,
).sort((a, b) => a[0].localeCompare(b[0]));
const belowReorder = inventory.filter((row) => Number(row.on_hand_units) < Number(row.reorder_point)).length;
const returnReasons = sumBy(returns, (row) => row.return_reason, (row) => Number(row.return_amount)).slice(0, 4);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720" role="img" aria-label="Retail Revenue and Customer Insights dashboard preview">
  <style>
    .bg { fill: #F8FAFC; }
    .panel { fill: #FFFFFF; stroke: #E5E7EB; stroke-width: 1; filter: drop-shadow(0 10px 24px rgba(15, 23, 42, 0.06)); }
    .title { fill: #111827; font: 700 30px Segoe UI, Arial, sans-serif; }
    .subtitle { fill: #64748B; font: 400 14px Segoe UI, Arial, sans-serif; }
    .panel-title { fill: #111827; font: 700 16px Segoe UI, Arial, sans-serif; }
    .kpi-label { fill: #64748B; font: 600 12px Segoe UI, Arial, sans-serif; text-transform: uppercase; }
    .kpi-value { fill: #111827; font: 700 28px Segoe UI, Arial, sans-serif; }
    .small { fill: #64748B; font: 400 12px Segoe UI, Arial, sans-serif; }
    .axis { fill: #475569; font: 600 12px Segoe UI, Arial, sans-serif; }
    .grid { stroke: #E5E7EB; stroke-width: 1; }
  </style>
  <rect width="1200" height="720" class="bg"/>
  <text x="44" y="50" class="title">Retail Revenue and Customer Insights</text>
  <text x="44" y="76" class="subtitle">Executive Overview | Synthetic Canadian outdoor retail dataset | 2023-2025</text>
  ${kpiCard({ label: "Net Sales", value: money(totalSales), note: `${sales.length.toLocaleString()} orders`, x: 44, y: 108, width: 208, accent: "#0F766E" })}
  ${kpiCard({ label: "Gross Profit", value: money(grossProfit), note: `${pct(grossProfit / totalSales)} margin`, x: 272, y: 108, width: 208, accent: "#2563EB" })}
  ${kpiCard({ label: "Return Amount", value: money(returnAmount), note: `${pct(returnAmount / totalSales)} of sales`, x: 500, y: 108, width: 208, accent: "#DC2626" })}
  ${kpiCard({ label: "Units Sold", value: units.toLocaleString(), note: `${belowReorder} items below reorder`, x: 728, y: 108, width: 208, accent: "#F59E0B" })}
  ${kpiCard({ label: "Top Region", value: topRegion.label, note: `${money(topRegion.value)} net sales`, x: 956, y: 108, width: 200, accent: "#7C3AED" })}
  ${lineChart({ title: "Net Sales Trend", entries: monthlySales, x: 44, y: 244, width: 668, height: 266 })}
  ${barChart({ title: "Sales by Category", entries: categorySales, x: 736, y: 244, width: 420, height: 266, color: "#2563EB" })}
  ${barChart({ title: "Sales by Region", entries: regionSales, x: 44, y: 532, width: 532, height: 164, color: "#0F766E", maxRows: 3, barHeight: 20, gap: 11 })}
  <g>
    <rect x="604" y="532" width="552" height="164" rx="14" class="panel"/>
    <text x="622" y="564" class="panel-title">Operational Watchlist</text>
    <text x="622" y="596" class="axis">Top product: ${escapeXml(topProduct.label)}</text>
    <text x="622" y="620" class="small">${money(topProduct.value)} net sales from the leading SKU</text>
    <text x="622" y="650" class="axis">Leading return reason: ${escapeXml(returnReasons[0][0])}</text>
    <text x="622" y="674" class="small">${money(returnReasons[0][1])} returned revenue tied to this reason</text>
  </g>
</svg>`;

fs.writeFileSync(path.join(assetsDir, "dashboard-preview.svg"), svg);
console.log(JSON.stringify({
  totalSales: Number(totalSales.toFixed(2)),
  grossProfit: Number(grossProfit.toFixed(2)),
  grossMargin: Number((grossProfit / totalSales).toFixed(4)),
  returnAmount: Number(returnAmount.toFixed(2)),
  returnRate: Number((returnAmount / totalSales).toFixed(4)),
  units,
  topRegion,
  topProduct,
  topCategory: topLabel(categorySales),
  belowReorder,
  leadingReturnReason: { label: returnReasons[0][0], value: Number(returnReasons[0][1].toFixed(2)) },
}, null, 2));

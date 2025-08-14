import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/hooks/useOrders";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CalendarDays, Calendar, TrendingUp } from "lucide-react";

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(d: Date) {
  return new Intl.DateTimeFormat(undefined, { month: "short", year: "numeric" }).format(d);
}

function dayKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function dayLabel(d: Date) {
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(d);
}

type ViewType = "7days" | "30days" | "3months" | "12months";

export default function OrdersMonthlyChart() {
  const { orders, loading } = useOrders();
  const [viewType, setViewType] = useState<ViewType>("30days");

  const { data, totalSales, totalOrders } = useMemo(() => {
    const now = new Date();
    let periods: { key: string; date: Date; label: string }[] = [];
    let keyFn = monthKey;
    let labelFn = monthLabel;

    switch (viewType) {
      case "7days":
        keyFn = dayKey;
        labelFn = dayLabel;
        for (let i = 6; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(d.getDate() - i);
          periods.push({ key: keyFn(d), date: d, label: labelFn(d) });
        }
        break;
      case "30days":
        keyFn = dayKey;
        labelFn = dayLabel;
        for (let i = 29; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(d.getDate() - i);
          periods.push({ key: keyFn(d), date: d, label: labelFn(d) });
        }
        break;
      case "3months":
        for (let i = 2; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          periods.push({ key: keyFn(d), date: d, label: labelFn(d) });
        }
        break;
      case "12months":
        for (let i = 11; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          periods.push({ key: keyFn(d), date: d, label: labelFn(d) });
        }
        break;
    }

    const base = periods.map(({ key, label }) => ({ key, label, orders: 0, revenue: 0 }));

    for (const o of orders) {
      const d = new Date(o.created_at);
      let key: string;
      
      if (viewType === "7days" || viewType === "30days") {
        key = dayKey(d);
      } else {
        key = monthKey(new Date(d.getFullYear(), d.getMonth(), 1));
      }
      
      const idx = base.findIndex((item) => item.key === key);
      if (idx >= 0) {
        base[idx].orders += 1;
        base[idx].revenue += Number(o.total || 0);
      }
    }

    const chartData = base.map((item) => ({ 
      label: item.label, 
      orders: item.orders, 
      revenue: Number(item.revenue.toFixed(2)) 
    }));

    const totalSales = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const totalOrders = orders.length;

    return { data: chartData, totalSales, totalOrders };
  }, [orders, viewType]);

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-bold">${totalSales.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Order</p>
                <p className="text-2xl font-bold">${totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : "0.00"}</p>
              </div>
              <CalendarDays className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sales Analytics</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={viewType === "7days" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewType("7days")}
              >
                7 Days
              </Button>
              <Button
                variant={viewType === "30days" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewType("30days")}
              >
                30 Days
              </Button>
              <Button
                variant={viewType === "3months" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewType("3months")}
              >
                3 Months
              </Button>
              <Button
                variant={viewType === "12months" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewType("12months")}
              >
                12 Months
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading chart…</p>
          ) : (
            <ChartContainer
              config={{
                revenue: { label: "Revenue ($)", color: "hsl(var(--primary))" },
                orders: { label: "Orders", color: "hsl(var(--secondary))" },
              }}
              className="h-72 w-full"
            >
              <ResponsiveContainer>
                <BarChart data={data} margin={{ left: 8, right: 8, top: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="label" 
                    tickLine={false} 
                    axisLine={false}
                    angle={viewType === "30days" ? -45 : 0}
                    textAnchor={viewType === "30days" ? "end" : "middle"}
                    height={viewType === "30days" ? 80 : 30}
                  />
                  <YAxis yAxisId="left" tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar 
                    yAxisId="left" 
                    dataKey="revenue" 
                    name="Revenue ($)" 
                    fill="var(--color-revenue)" 
                    radius={[4,4,0,0]} 
                  />
                  <Bar 
                    yAxisId="right" 
                    dataKey="orders" 
                    name="Orders" 
                    fill="var(--color-orders)" 
                    radius={[4,4,0,0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

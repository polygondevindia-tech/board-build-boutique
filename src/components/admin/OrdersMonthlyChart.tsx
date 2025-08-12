import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  LineChart,
  Line,
} from "recharts";

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(d: Date) {
  return new Intl.DateTimeFormat(undefined, { month: "short", year: "numeric" }).format(d);
}

export default function OrdersMonthlyChart() {
  const { orders, loading } = useOrders();

  const data = useMemo(() => {
    const now = new Date();
    const months: { key: string; date: Date }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ key: monthKey(d), date: d });
    }
    const base = months.map(({ key, date }) => ({ key, label: monthLabel(date), orders: 0, revenue: 0 }));

    for (const o of orders) {
      const d = new Date(o.created_at);
      const key = monthKey(new Date(d.getFullYear(), d.getMonth(), 1));
      const idx = base.findIndex((m) => m.key === key);
      if (idx >= 0) {
        base[idx].orders += 1;
        base[idx].revenue += Number(o.total || 0);
      }
    }

    return base.map((m) => ({ label: m.label, orders: m.orders, revenue: Number(m.revenue.toFixed(2)) }));
  }, [orders]);

  return (
    <Card>
      <CardContent className="pt-6">
        {loading ? (
          <p className="text-muted-foreground">Loading chart…</p>
        ) : (
          <ChartContainer
            config={{
              revenue: { label: "Revenue", color: "hsl(var(--primary))" },
              orders: { label: "Orders", color: "hsl(var(--secondary-foreground))" },
            }}
            className="h-72 w-full"
          >
            <ResponsiveContainer>
              <BarChart data={data} margin={{ left: 8, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="var(--color-revenue)" radius={[4,4,0,0]} />
                <Line yAxisId="right" type="monotone" dataKey="orders" name="Orders" stroke="var(--color-orders)" strokeWidth={2} />
          </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

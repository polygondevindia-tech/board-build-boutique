import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

// Admin-only: Seed a batch of demo orders with items for the last 12 months
export default function SeedDemoOrders() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [seeding, setSeeding] = useState(false);

  const getRandomDateInLastMonths = (months: number) => {
    const now = new Date();
    const start = new Date();
    start.setMonth(now.getMonth() - months + 1);
    const time = start.getTime() + Math.random() * (now.getTime() - start.getTime());
    return new Date(time);
  };

  const handleSeed = async () => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in as admin.", variant: "destructive" });
      return;
    }

    setSeeding(true);
    try {
      const N = 20; // number of demo orders
      const statuses = ["pending", "paid", "processing", "shipped", "delivered", "canceled", "refunded"] as const;
      const productNames = [
        "Sensor Module",
        "Arduino Board",
        "Custom PCB",
        "Connector Kit",
        "Power Regulator",
        "Microcontroller",
        "LED Strip",
        "Resistor Pack",
      ];

      type ItemTemplate = { name: string; quantity: number; unit_price: number; line_total: number };
      const orderItemsTemplates: ItemTemplate[][] = [];
      const ordersToInsert: any[] = [];

      for (let i = 0; i < N; i++) {
        const createdAt = getRandomDateInLastMonths(12);
        const itemCount = 1 + Math.floor(Math.random() * 3);
        const items: ItemTemplate[] = [];
        for (let j = 0; j < itemCount; j++) {
          const name = productNames[Math.floor(Math.random() * productNames.length)];
          const quantity = 1 + Math.floor(Math.random() * 3);
          const unit_price = parseFloat((5 + Math.random() * 200).toFixed(2));
          const line_total = parseFloat((unit_price * quantity).toFixed(2));
          items.push({ name, quantity, unit_price, line_total });
        }
        const orderTotal = parseFloat(items.reduce((sum, it) => sum + it.line_total, 0).toFixed(2));
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        orderItemsTemplates.push(items);
        ordersToInsert.push({
          user_id: user.id,
          status,
          total: orderTotal,
          currency: "USD",
          customer_email: user.email ?? null,
          created_at: createdAt.toISOString(),
        });
      }

      const { data: insertedOrders, error: insertOrdersError } = await supabase
        .from("orders")
        .insert(ordersToInsert)
        .select("id");

      if (insertOrdersError) throw insertOrdersError;
      if (!insertedOrders || insertedOrders.length === 0) throw new Error("No orders inserted");

      const itemsToInsert = insertedOrders.flatMap((o, idx) =>
        orderItemsTemplates[idx].map((it) => ({
          order_id: o.id,
          product_id: null,
          name: it.name,
          quantity: it.quantity,
          unit_price: it.unit_price,
          line_total: it.line_total,
        }))
      );

      const { error: insertItemsError } = await supabase
        .from("order_items")
        .insert(itemsToInsert);

      if (insertItemsError) throw insertItemsError;

      await Promise.all([
        qc.invalidateQueries({ queryKey: ["orders"] }),
      ]);

      toast({ title: "Demo orders added", description: `${N} demo orders have been created.` });
    } catch (err: any) {
      toast({ title: "Failed to add demo orders", description: err.message ?? String(err), variant: "destructive" });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <Button size="sm" onClick={handleSeed} disabled={seeding} variant="secondary">
      {seeding ? "Seeding..." : "Add Demo Orders"}
    </Button>
  );
}

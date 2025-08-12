import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface OrderRow {
  id: string;
  user_id: string;
  status: string;
  total: number;
  currency: string;
  customer_email: string | null;
  created_at: string;
}

export const useOrders = () => {
  const query = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id,user_id,status,total,currency,customer_email,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as OrderRow[];
    },
    staleTime: 60_000,
  });

  return {
    orders: query.data ?? [],
    loading: query.isLoading,
    error: query.error as Error | null,
    refreshOrders: () => query.refetch(),
  };
};

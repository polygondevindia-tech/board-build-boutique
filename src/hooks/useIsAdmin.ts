import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useIsAdmin = () => {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["is-admin", user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data, error } = await supabase
        .from("user_roles")
        .select("id")
        .eq("role", "admin")
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return Boolean(data);
    },
    enabled: Boolean(user),
    staleTime: 60_000,
  });

  return { isAdmin: Boolean(data), isLoading, error };
};

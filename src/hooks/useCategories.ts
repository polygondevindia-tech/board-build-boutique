import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (err: any) {
      console.error("Error fetching categories", err);
      setError(err.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => fetchCategories();

  const addCategory = async (name: string, description?: string) => {
    const { data, error } = await supabase
      .from("categories")
      .insert([{ name, description: description || null }])
      .select()
      .maybeSingle();
    if (error) throw error;
    await fetchCategories();
    return data as Category | null;
  };

  const updateCategory = async (
    id: string,
    updates: Partial<Pick<Category, "name" | "description" | "is_active">>
  ) => {
    const { error } = await supabase
      .from("categories")
      .update(updates)
      .eq("id", id);
    if (error) throw error;
    await fetchCategories();
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);
    if (error) throw error;
    await fetchCategories();
  };

  return { categories, loading, error, refresh, addCategory, updateCategory, deleteCategory };
};

import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import Papa from "papaparse";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Loader2 } from "lucide-react";

const setMeta = (name: string, content: string) => {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const downloadCSV = (csv: string, filename: string) => {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const Migration = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useIsAdmin();

  useEffect(() => {
    document.title = "WooCommerce Migration Export | ccanand";
    setMeta(
      "description",
      "Export products and categories to WooCommerce CSV for WordPress migration."
    );

    // Canonical tag
    let link: HTMLLinkElement | null = document.querySelector(
      'link[rel="canonical"]'
    );
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", window.location.href);
  }, []);

  const exportProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select(
        "id,name,description,price,original_price,image_url,category,in_stock"
      );

    if (error) {
      console.error("Failed to fetch products for export:", error);
      return;
    }

    const rows = (data || []).map((p: any) => {
      const regular = p.original_price ?? p.price;
      const sale = p.original_price ? String(p.price) : "";
      return {
        Type: "simple",
        SKU: "",
        Name: p.name,
        Published: 1,
        "Visibility in catalog": "visible",
        "Short description": "",
        Description: p.description ?? "",
        "Regular price": regular ?? "",
        "Sale price": sale,
        Categories: p.category ?? "",
        Images: p.image_url ?? "",
        "In stock?": p.in_stock ? 1 : 0,
      };
    });

    const csv = Papa.unparse(rows, { header: true });
    downloadCSV(csv, "products-woocommerce.csv");
  };

  const exportCategories = async () => {
    const { data, error } = await supabase.from("categories").select("name, description");
    if (error) {
      console.error("Failed to fetch categories for export:", error);
      return;
    }

    const rows = (data || []).map((c: any) => ({
      name: c.name,
      slug: "",
      description: c.description ?? "",
      parent: "",
    }));

    const csv = Papa.unparse(rows, { header: true });
    downloadCSV(csv, "categories-woocommerce.csv");
  };

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-foreground" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen">
        <Header />
        <main>
          <section className="container mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-foreground mb-2">Migration Tools</h1>
            <p className="text-muted-foreground">Restricted: Admins only.</p>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section className="container mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">WooCommerce Migration Export</h1>
          <p className="text-muted-foreground mb-8">
            Export your current catalog to CSV files compatible with WooCommerce's importer.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Products CSV</CardTitle>
                <CardDescription>
                  Includes name, description, regular/sale price, stock, category, and image URL.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={exportProducts}>Download Products CSV</Button>
              </CardContent>
            </Card>

            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Categories CSV</CardTitle>
                <CardDescription>
                  Basic taxonomy export (name, description). Parent/slug can be adjusted in WooCommerce.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="secondary" onClick={exportCategories}>Download Categories CSV</Button>
              </CardContent>
            </Card>
          </div>

          <article className="mt-10 prose prose-invert max-w-none">
            <h2>How to import into WooCommerce</h2>
            <ol>
              <li>In WordPress Admin, go to Products → All Products → Import, upload products-woocommerce.csv.</li>
              <li>Map columns: ensure Name, Regular price, Sale price, Categories, Images, In stock? are recognized.</li>
              <li>Then go to Products → Categories → Import, upload categories-woocommerce.csv.</li>
            </ol>
          </article>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Migration;

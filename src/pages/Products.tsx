import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";

const Products = () => {
  useEffect(() => {
    document.title = "Products | ccanand";
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section className="container mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">Products</h1>
          <p className="text-muted-foreground mb-8">
            Explore our high-quality PCB selection. Add items to your cart or request a custom quote.
          </p>
          <ProductGrid />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Products;

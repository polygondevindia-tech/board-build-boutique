import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Loader2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useProducts } from "@/hooks/useProducts";
import pcbArduino from "@/assets/pcb-arduino.jpg";
import pcbSensor from "@/assets/pcb-sensor.jpg";
import pcbCustom from "@/assets/pcb-custom.jpg";

// Fallback images for products without images
const fallbackImages = [pcbArduino, pcbSensor, pcbCustom];

const ProductGrid = () => {
  const { addToCart } = useCart();
  const { products, loading, error } = useProducts();

  const getProductImage = (product: any, index: number) => {
    if (product.image_url) {
      return product.image_url;
    }
    return fallbackImages[index % fallbackImages.length];
  };

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: `$${product.price}`,
      image: getProductImage(product, 0),
      category: product.category,
    });
  };

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2 text-lg">Loading products...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center min-h-[400px] flex items-center justify-center">
            <div>
              <h3 className="text-lg font-semibold mb-2">Failed to load products</h3>
              <p className="text-muted-foreground">{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Featured PCB Products
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular circuit boards, from development kits to specialized modules
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden">
                  <img 
                    src={getProductImage(product, index)} 
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary">{product.category}</Badge>
                  </div>
                  {product.original_price && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="destructive">Sale</Badge>
                    </div>
                  )}
                  {!product.in_stock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="outline" className="bg-background">Out of Stock</Badge>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                  {product.name}
                </CardTitle>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium ml-1">{product.rating || 0}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">({product.review_count || 0} reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-foreground">${product.price}</span>
                  {product.original_price && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${product.original_price}
                    </span>
                  )}
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Button 
                  className="w-full" 
                  variant={product.in_stock ? "default" : "secondary"}
                  disabled={!product.in_stock}
                  onClick={() => product.in_stock && handleAddToCart(product)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.in_stock ? "Add to Cart" : "Notify When Available"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button variant="tech" size="lg">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
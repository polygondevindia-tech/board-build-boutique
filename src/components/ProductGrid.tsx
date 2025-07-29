import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import pcbArduino from "@/assets/pcb-arduino.jpg";
import pcbSensor from "@/assets/pcb-sensor.jpg";
import pcbCustom from "@/assets/pcb-custom.jpg";

const products = [
  {
    id: 1,
    name: "Arduino Compatible Dev Board",
    price: "$24.99",
    originalPrice: "$29.99",
    image: pcbArduino,
    rating: 4.8,
    reviews: 156,
    category: "Development Boards",
    inStock: true
  },
  {
    id: 2,
    name: "Multi-Sensor Module PCB",
    price: "$18.99",
    image: pcbSensor,
    rating: 4.9,
    reviews: 89,
    category: "Sensor Modules",
    inStock: true
  },
  {
    id: 3,
    name: "Custom Prototype Board",
    price: "$15.99",
    image: pcbCustom,
    rating: 4.7,
    reviews: 234,
    category: "Prototyping",
    inStock: false
  }
];

const ProductGrid = () => {
  const { addToCart } = useCart();

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
  };

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
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary">{product.category}</Badge>
                  </div>
                  {product.originalPrice && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="destructive">Sale</Badge>
                    </div>
                  )}
                  {!product.inStock && (
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
                    <span className="text-sm font-medium ml-1">{product.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-foreground">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {product.originalPrice}
                    </span>
                  )}
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Button 
                  className="w-full" 
                  variant={product.inStock ? "default" : "secondary"}
                  disabled={!product.inStock}
                  onClick={() => product.inStock && handleAddToCart(product)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.inStock ? "Add to Cart" : "Notify When Available"}
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
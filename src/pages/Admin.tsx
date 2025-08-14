import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Upload, Settings } from 'lucide-react';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useCategories } from '@/hooks/useCategories';
import CategoryManager from '@/components/admin/CategoryManager';
import BulkImportModal from '@/components/admin/BulkImportModal';
import OrdersTable from '@/components/admin/OrdersTable';
import OrdersMonthlyChart from '@/components/admin/OrdersMonthlyChart';
import SeedDemoOrders from '@/components/admin/SeedDemoOrders';
const Admin = () => {
  const { user } = useAuth();
  const { isAdmin, isLoading } = useIsAdmin();
  const { products, loading, refreshProducts } = useProducts();
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    category: '',
    in_stock: true
  });

  const { categories: categoriesList } = useCategories();

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      original_price: '',
      category: '',
      in_stock: true
    });
    setIsAdding(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to manage products.",
        variant: "destructive"
      });
      return;
    }

    try {
      const productData = {
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        category: formData.category,
        in_stock: formData.in_stock
      };

      let error;
      
      if (editingProduct) {
        ({ error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id));
      } else {
        ({ error } = await supabase
          .from('products')
          .insert([productData]));
      }

      if (error) throw error;

      toast({
        title: `Product ${editingProduct ? 'updated' : 'created'} successfully`,
        description: `${formData.name} has been ${editingProduct ? 'updated' : 'added'} to the catalog.`
      });

      resetForm();
      refreshProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      original_price: product.original_price?.toString() || '',
      category: product.category,
      in_stock: product.in_stock
    });
    setIsAdding(true);
  };

  const handleDelete = async (productId: string) => {
    if (!user) return;
    
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Product deleted",
        description: "The product has been removed from the catalog."
      });

      refreshProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Restricted</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Please log in to access the admin panel.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isLoading && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Access Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Your account does not have admin permissions. Please contact an administrator.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Product Management</h1>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowBulkImport(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Bulk Import
            </Button>
            <Button variant="outline" onClick={() => setShowCategoryManager((v) => !v)}>
              <Settings className="h-4 w-4 mr-2" />
              Manage Categories
            </Button>
            <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {showCategoryManager && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Category Manager</CardTitle>
            </CardHeader>
            <CardContent>
              <CategoryManager />
            </CardContent>
          </Card>
        )}

        {isAdding && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                          {categoriesList.map((cat) => (
                            <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="original_price">Original Price ($)</Label>
                    <Input
                      id="original_price"
                      type="number"
                      step="0.01"
                      value={formData.original_price}
                      onChange={(e) => setFormData({...formData, original_price: e.target.value})}
                      placeholder="Optional"
                    />
                  </div>
                  <div className="flex items-center space-x-2 mt-6">
                    <Switch
                      id="in_stock"
                      checked={formData.in_stock}
                      onCheckedChange={(checked) => setFormData({...formData, in_stock: checked})}
                    />
                    <Label htmlFor="in_stock">In Stock</Label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Order Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">Product List</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 mt-6">
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>Orders Overview</CardTitle>
                <SeedDemoOrders />
              </CardHeader>
              <CardContent>
                <OrdersMonthlyChart />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <OrdersTable />
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <div className="space-y-4">
              {loading ? (
                <p>Loading products...</p>
              ) : (
                products.map((product) => (
                  <Card key={product.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{product.name}</h3>
                          <p className="text-muted-foreground text-sm mb-2">{product.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="font-medium">${product.price}</span>
                            {product.original_price && (
                              <span className="text-muted-foreground line-through">${product.original_price}</span>
                            )}
                            <span className="bg-secondary px-2 py-1 rounded text-xs">{product.category}</span>
                            <span className={`px-2 py-1 rounded text-xs ${product.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {product.in_stock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(product.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
        <BulkImportModal open={showBulkImport} onOpenChange={setShowBulkImport} onImported={() => { refreshProducts(); }} />
      </div>
    </div>
  );
};

export default Admin;
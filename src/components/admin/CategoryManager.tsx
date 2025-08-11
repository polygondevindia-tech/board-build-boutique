import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCategories } from "@/hooks/useCategories";
import { toast } from "@/hooks/use-toast";
import { Edit, Trash2, Save, X } from "lucide-react";

const CategoryManager = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editActive, setEditActive] = useState(true);

  const handleAdd = async () => {
    if (!name.trim()) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }
    try {
      await addCategory(name.trim(), description.trim() || undefined);
      setName("");
      setDescription("");
      toast({ title: "Category added" });
    } catch (err: any) {
      toast({ title: "Add failed", description: err.message || String(err), variant: "destructive" });
    }
  };

  const startEdit = (id: string) => {
    const c = categories.find((c) => c.id === id);
    if (!c) return;
    setEditingId(id);
    setEditName(c.name);
    setEditDescription(c.description || "");
    setEditActive(c.is_active);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      await updateCategory(editingId, { name: editName.trim(), description: editDescription.trim(), is_active: editActive });
      setEditingId(null);
      toast({ title: "Category updated" });
    } catch (err: any) {
      toast({ title: "Update failed", description: err.message || String(err), variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    try {
      await deleteCategory(id);
      toast({ title: "Category deleted" });
    } catch (err: any) {
      toast({ title: "Delete failed", description: err.message || String(err), variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="grid md:grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor="cat-name">Name</Label>
              <Input id="cat-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sensor Modules" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="cat-desc">Description (optional)</Label>
              <Input id="cat-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" />
            </div>
            <div className="md:col-span-3">
              <Button onClick={handleAdd}>Add Category</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="border rounded">
        <div className="grid grid-cols-12 gap-2 p-3 border-b text-sm font-medium">
          <div className="col-span-4">Name</div>
          <div className="col-span-5">Description</div>
          <div className="col-span-1">Active</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        {categories.map((c) => (
          <div key={c.id} className="grid grid-cols-12 gap-2 p-3 border-b last:border-b-0 items-center">
            <div className="col-span-4">
              {editingId === c.id ? (
                <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
              ) : (
                <div className="font-medium">{c.name}</div>
              )}
            </div>
            <div className="col-span-5">
              {editingId === c.id ? (
                <Input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
              ) : (
                <div className="text-sm text-muted-foreground truncate">{c.description}</div>
              )}
            </div>
            <div className="col-span-1 flex items-center">
              {editingId === c.id ? (
                <Switch checked={editActive} onCheckedChange={setEditActive} />
              ) : (
                <span className="text-sm">{c.is_active ? "Yes" : "No"}</span>
              )}
            </div>
            <div className="col-span-2 flex justify-end gap-2">
              {editingId === c.id ? (
                <>
                  <Button size="sm" variant="secondary" onClick={saveEdit}><Save className="h-4 w-4 mr-1" />Save</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)}><X className="h-4 w-4 mr-1" />Cancel</Button>
                </>
              ) : (
                <>
                  <Button size="sm" variant="outline" onClick={() => startEdit(c.id)}><Edit className="h-4 w-4" /></Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(c.id)}><Trash2 className="h-4 w-4" /></Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManager;

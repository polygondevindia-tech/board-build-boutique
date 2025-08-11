import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Papa from "papaparse";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface BulkImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImported?: () => void;
}

interface CsvRow {
  name: string;
  description?: string;
  price: string | number;
  original_price?: string | number;
  image_url?: string;
  category: string;
  in_stock?: string | boolean | number;
  rating?: string | number;
  review_count?: string | number;
}

const chunk = <T,>(arr: T[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size));

const toBool = (v: any) => {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    return s === "true" || s === "1" || s === "yes" || s === "y";
  }
  return false;
};

const toNumOrNull = (v: any): number | null => {
  if (v === undefined || v === null || v === "") return null;
  const n = typeof v === "number" ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : null;
};

const BulkImportModal = ({ open, onOpenChange, onImported }: BulkImportModalProps) => {
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFile = (file: File) => {
    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
      complete: (results) => {
        const data = (results.data || []).filter((r) => r && r.name && r.price && r.category);
        setRows(data);
        toast({ title: "CSV parsed", description: `${data.length} rows ready for import.` });
      },
      error: (err) => {
        console.error(err);
        toast({ title: "Parse error", description: String(err), variant: "destructive" });
      }
    });
  };

  const handleImport = async () => {
    if (!rows.length) {
      toast({ title: "No data", description: "Please upload a CSV first.", variant: "destructive" });
      return;
    }
    try {
      setUploading(true);
      setProgress(0);

      const mapped = rows.map((r) => ({
        name: String(r.name).trim(),
        description: r.description ? String(r.description) : null,
        price: Number(r.price),
        original_price: toNumOrNull(r.original_price),
        image_url: r.image_url ? String(r.image_url) : null,
        category: String(r.category).trim(),
        in_stock: toBool(r.in_stock ?? true),
        rating: toNumOrNull(r.rating),
        review_count: toNumOrNull(r.review_count),
      }));

      const chunks = chunk(mapped, 100);
      for (let i = 0; i < chunks.length; i++) {
        const { error } = await supabase.from("products").insert(chunks[i]);
        if (error) throw error;
        setProgress(Math.round(((i + 1) / chunks.length) * 100));
      }

      toast({ title: "Import complete", description: `${mapped.length} products imported.` });
      onImported?.();
      onOpenChange(false);
      setRows([]);
    } catch (err: any) {
      console.error("Import failed", err);
      toast({ title: "Import failed", description: err.message || String(err), variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => {!uploading && onOpenChange(o)}}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Import Products (CSV)</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Input type="file" accept=".csv" onChange={(e) => e.target.files && handleFile(e.target.files[0])} />
            <p className="text-sm text-muted-foreground mt-2">
              Expected columns: name, description, price, original_price, image_url, category, in_stock, rating, review_count
            </p>
          </div>
          {rows.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm">Previewing first {Math.min(10, rows.length)} of {rows.length} rows</p>
              <div className="max-h-40 overflow-auto border rounded">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      {Object.keys(rows[0]).map((k) => (
                        <th key={k} className="p-2 border-b">{k}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 10).map((r, i) => (
                      <tr key={i}>
                        {Object.keys(rows[0]).map((k) => (
                          <td key={k} className="p-2 border-b align-top">{String((r as any)[k] ?? "")}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {uploading && (
                <div className="text-sm">Uploading... {progress}%</div>
              )}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => !uploading && onOpenChange(false)} disabled={uploading}>Cancel</Button>
          <Button onClick={handleImport} disabled={uploading || rows.length === 0}>Import</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkImportModal;

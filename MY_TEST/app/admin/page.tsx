"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type FileRecord = {
  id: string;
  originalName: string;
  storedPath: string;
  mimeType: string;
  sizeBytes: number;
  isImage: number | boolean;
  createdAt: number;
  deletedAt?: number | null;
};

const formatBytes = (value: number) => {
  if (!Number.isFinite(value)) return "-";
  const units = ["B", "KB", "MB", "GB"];
  let size = value;
  let index = 0;
  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index += 1;
  }
  return `${size.toFixed(1)} ${units[index]}`;
};

export default function AdminPage() {
  const [items, setItems] = useState<FileRecord[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    const response = await fetch("/api/admin/files", { cache: "no-store" });
    if (!response.ok) {
      setError("Failed to load files. Are you logged in?");
      return;
    }
    const data = await response.json();
    setItems(data.items ?? []);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (!fileArray.length) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    fileArray.forEach((file) => formData.append("files", file));

    const response = await fetch("/api/admin/files/upload", {
      method: "POST",
      body: formData,
    });

    setUploading(false);

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.error ?? "Upload failed");
      return;
    }

    await fetchItems();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    if (event.dataTransfer.files?.length) {
      handleUpload(event.dataTransfer.files);
    }
  };

  const handleHideRestore = async (id: string, restore: boolean) => {
    const endpoint = restore
      ? `/api/admin/files/${id}/restore`
      : `/api/admin/files/${id}/hide`;
    await fetch(endpoint, { method: "POST" });
    await fetchItems();
  };

  const handleCopy = (id: string) => {
    const url = `${window.location.origin}/api/files/${id}`;
    navigator.clipboard.writeText(url).catch(() => null);
  };

  const rowCountLabel = useMemo(() => `${items.length} files`, [items.length]);

  return (
    <main className="min-h-screen p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`flex flex-col items-center justify-center gap-3 rounded-md border border-dashed p-8 text-center transition ${
              dragActive ? "border-neutral-900" : "border-neutral-300"
            }`}
            onDragOver={(event) => {
              event.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
          >
            <p className="text-sm text-neutral-600">
              Drag and drop files here, or choose files to upload.
            </p>
            <Input
              type="file"
              multiple
              onChange={(event) => {
                if (event.target.files) {
                  handleUpload(event.target.files);
                }
              }}
            />
            <Button disabled={uploading} onClick={() => fetchItems()}>
              {uploading ? "Uploading..." : "Refresh"}
            </Button>
          </div>
          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Files ({rowCountLabel})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.originalName}
                  </TableCell>
                  <TableCell>{item.mimeType}</TableCell>
                  <TableCell>{formatBytes(item.sizeBytes)}</TableCell>
                  <TableCell>
                    {item.deletedAt ? "Hidden" : "Visible"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(item.id)}
                      >
                        Copy URL
                      </Button>
                      <Button
                        variant={item.deletedAt ? "secondary" : "destructive"}
                        size="sm"
                        onClick={() =>
                          handleHideRestore(item.id, Boolean(item.deletedAt))
                        }
                      >
                        {item.deletedAt ? "Restore" : "Hide"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}

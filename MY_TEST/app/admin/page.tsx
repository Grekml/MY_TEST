"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    const requestFiles = () =>
      fetch("/api/admin/files", { cache: "no-store", credentials: "include" });

    let response = await requestFiles();
    if (response.status === 401) {
      const refresh = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });
      if (refresh.ok) {
        response = await requestFiles();
      }
    }

    if (!response.ok) {
      setError("Не удалось загрузить файлы. Вы вошли в систему?");
      return;
    }

    const data = await response.json();
    setItems(data.items ?? []);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAdminEmail(window.sessionStorage.getItem("adminEmail"));
    }
  }, []);

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
      credentials: "include",
    });

    setUploading(false);

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.error ?? "Ошибка загрузки");
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
    await fetch(endpoint, { method: "POST", credentials: "include" });
    await fetchItems();
  };

  const handleCopy = (id: string) => {
    const url = `${window.location.origin}/api/files/${id}`;
    navigator.clipboard.writeText(url).catch(() => null);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("adminEmail");
      window.location.href = "/admin/login";
    }
  };

  const rowCountLabel = useMemo(() => `${items.length} files`, [items.length]);

  return (
    <main className="min-h-screen p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Админка</h1>
          <p className="text-sm text-neutral-600">
            Управление загрузками и статусами.
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-10 w-10 rounded-full p-0"
              aria-label="Profile"
            >
              <span className="text-sm font-medium">
                {adminEmail?.[0]?.toUpperCase() ?? "A"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {adminEmail ?? "admin@example.com"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Выйти</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Загрузки</CardTitle>
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
              Перетащите файлы сюда или выберите их для загрузки.
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
              {uploading ? "Загрузка..." : "Обновить"}
            </Button>
          </div>
          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Файлы ({rowCountLabel})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Превью</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Размер</TableHead>
                <TableHead>Оценки</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {Boolean(item.isImage) ? (
                      <div className="h-8 w-8 overflow-hidden rounded border border-neutral-200">
                        <img
                          alt={item.originalName}
                          src={`/api/files/${item.id}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded border border-dashed border-neutral-200 bg-neutral-50" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {item.originalName}
                  </TableCell>
                  <TableCell>{item.mimeType}</TableCell>
                  <TableCell>{formatBytes(item.sizeBytes)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 text-xs text-neutral-600">
                      <span className="inline-flex items-center gap-1">
                        <svg
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="h-3.5 w-3.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M7 10v12" />
                          <path d="M15 5l-4 5v12h6.4a2 2 0 0 0 1.9-1.4l2-7a2 2 0 0 0-1.9-2.6H11" />
                          <path d="M7 10a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2" />
                        </svg>
                        <span>{item.likeCount ?? 0}</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <svg
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="h-3.5 w-3.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17 14V2" />
                          <path d="M9 19l4-5V2H6.6a2 2 0 0 0-1.9 1.4l-2 7A2 2 0 0 0 4.6 13H13" />
                          <path d="M17 14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2" />
                        </svg>
                        <span>{item.dislikeCount ?? 0}</span>
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.deletedAt ? "Скрыт" : "Виден"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(item.id)}
                      >
                        Скопировать URL
                      </Button>
                      <Button
                        variant={item.deletedAt ? "secondary" : "destructive"}
                        size="sm"
                        onClick={() =>
                          handleHideRestore(item.id, Boolean(item.deletedAt))
                        }
                      >
                        {item.deletedAt ? "Восстановить" : "Скрыть"}
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

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type FileRecord = {
  id: string;
  title: string;
  description: string;
  originalName: string;
  storedPath: string;
  mimeType: string;
  sizeBytes: number;
  isImage: number | boolean;
  likeCount?: number;
  dislikeCount?: number;
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
  const { theme, setTheme } = useTheme();
  const [items, setItems] = useState<FileRecord[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const isDark = theme === "dark";
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const stats = useMemo(() => {
    const total = items.length;
    const hidden = items.filter((item) => Boolean(item.deletedAt)).length;
    const visible = total - hidden;
    const images = items.filter((item) => Boolean(item.isImage)).length;
    return { total, hidden, visible, images };
  }, [items]);

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
    const hydrated = (data.items ?? []).map((item: FileRecord) => ({
      ...item,
      title: item.title || item.originalName,
      description: item.description || item.originalName,
    }));
    setItems(hydrated);
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

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const byFilter = items.filter((item) => {
      if (filter === "visible") return !item.deletedAt;
      if (filter === "hidden") return Boolean(item.deletedAt);
      if (filter === "images") return Boolean(item.isImage);
      return true;
    });

    if (!normalizedQuery) return byFilter;

    return byFilter.filter((item) => {
      const haystack = [
        item.title,
        item.description,
        item.originalName,
        item.mimeType,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [items, query, filter]);

  const rowCountLabel = useMemo(
    () => `${filteredItems.length} из ${items.length}`,
    [filteredItems.length, items.length]
  );

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto flex w-full max-w-7xl gap-6 px-6 py-6">
        <aside className="hidden h-fit w-64 flex-col gap-6 rounded-xl border bg-background/80 p-4 shadow-sm lg:flex">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Навигация
            </p>
            <h2 className="text-lg font-semibold">Админка</h2>
            <p className="text-xs text-muted-foreground">
              Управление загрузками
            </p>
          </div>
          <div className="flex flex-col gap-1 text-sm">
            <button className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-foreground">
              Обзор
            </button>
            <button className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground">
              Файлы
            </button>
            <button className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground">
              Загрузки
            </button>
            <button className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground">
              Настройки
            </button>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
            Загружайте файлы и контролируйте доступность на сайте.
          </div>
        </aside>

        <section className="flex-1 space-y-6">
          <div className="flex flex-col gap-4 rounded-xl border bg-background/80 p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Панель управления
              </p>
              <h1 className="text-2xl font-semibold">Админка</h1>
              <p className="text-sm text-muted-foreground">
                Управление загрузками и статусами.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Input
                  placeholder="Поиск по файлам"
                  className="h-9 w-56 pr-8"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                {query ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    onClick={() => setQuery("")}
                    aria-label="Очистить"
                  >
                    ×
                  </Button>
                ) : null}
              </div>
              <Button variant="outline" onClick={() => fetchItems()}>
                Обновить
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 w-10 rounded-full p-0"
                    aria-label="Профиль"
                  >
                    <span className="text-sm font-medium">
                      {adminEmail?.[0]?.toUpperCase() ?? "A"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    {adminEmail ?? "admin@example.com"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setTheme(isDark ? "light" : "dark")}
                    className="flex items-center justify-between"
                  >
                    <span>Темная тема</span>
                    <span
                      className={`inline-flex h-5 w-9 items-center rounded-full border transition ${
                        isDark
                          ? "border-neutral-600 bg-neutral-900"
                          : "border-neutral-300 bg-neutral-200"
                      }`}
                    >
                      <span
                        className={`h-4 w-4 rounded-full bg-white shadow transition ${
                          isDark ? "translate-x-4" : "translate-x-1"
                        }`}
                      />
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Выйти</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                  Всего файлов
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">{stats.total}</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                  Видимые
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">{stats.visible}</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                  Скрытые
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">{stats.hidden}</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                  Изображения
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">{stats.images}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Загрузки</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-background/60 p-8 text-center transition ${
              dragActive ? "border-foreground" : "border-border"
            }`}
            onDragOver={(event) => {
              event.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
          >
            <p className="text-sm text-muted-foreground">
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

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Файлы ({rowCountLabel})</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={filter} onValueChange={setFilter}>
                <TabsList>
                  <TabsTrigger value="all">
                    Все ({stats.total})
                  </TabsTrigger>
                  <TabsTrigger value="visible">
                    Видимые ({stats.visible})
                  </TabsTrigger>
                  <TabsTrigger value="hidden">
                    Скрытые ({stats.hidden})
                  </TabsTrigger>
                  <TabsTrigger value="images">
                    Изображения ({stats.images})
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
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
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                  <TableCell>
                    {Boolean(item.isImage) ? (
                      <div className="h-8 w-8 overflow-hidden rounded border border-border bg-background">
                        <img
                          alt={item.originalName}
                          src={`/api/files/${item.id}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded border border-dashed border-border bg-muted" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {item.originalName}
                  </TableCell>
                  <TableCell>{item.mimeType}</TableCell>
                  <TableCell>{formatBytes(item.sizeBytes)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            aria-label="Меню"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="5" r="1.5" />
                              <circle cx="12" cy="12" r="1.5" />
                              <circle cx="12" cy="19" r="1.5" />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              (window.location.href = `/admin/files/${item.id}/edit`)
                            }
                          >
                            Редактировать
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCopy(item.id)}>
                            Скопировать URL
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              handleHideRestore(item.id, Boolean(item.deletedAt))
                            }
                          >
                            {item.deletedAt ? "Восстановить" : "Удалить"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}

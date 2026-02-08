"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FileRecord = {
  id: string;
  title: string;
  description: string;
  originalName: string;
};

export default function AdminEditFilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const load = async () => {
      const response = await fetch(`/api/admin/files/${params.id}`, {
        credentials: "include",
        cache: "no-store",
      });
      if (!response.ok) {
        setError("Не удалось загрузить файл");
        setLoading(false);
        return;
      }
      const data = (await response.json()) as { item: FileRecord };
      setTitle(data.item.title || data.item.originalName);
      setDescription(data.item.description || data.item.originalName);
      setLoading(false);
    };
    load();
  }, [params.id]);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const response = await fetch(`/api/admin/files/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title, description }),
    });

    setSaving(false);

    if (!response.ok) {
      setError("Не удалось сохранить изменения");
      return;
    }

    router.push("/admin");
  };

  return (
    <main className="min-h-screen p-6">
      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <CardTitle>Редактирование файла</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-neutral-600">Загрузка...</p>
          ) : (
            <form className="space-y-4" onSubmit={handleSave}>
              <div className="space-y-2">
                <Label htmlFor="title">Название</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <textarea
                  id="description"
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
                  rows={4}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  required
                />
              </div>
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving ? "Сохранение..." : "Сохранить"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin")}
                >
                  Отмена
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

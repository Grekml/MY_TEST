"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type FileRecord = {
  id: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  isImage: number | boolean;
  likeCount: number;
  dislikeCount: number;
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

export default function GalleryPage() {
  const [items, setItems] = useState<FileRecord[]>([]);
  const [selected, setSelected] = useState<FileRecord | null>(null);

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/files", { cache: "no-store" });
      const data = await response.json();
      setItems(data.items ?? []);
    };
    load();
  }, []);

  const updateVote = async (id: string, action: "like" | "dislike") => {
    const response = await fetch(`/api/files/${id}/${action}`, { method: "POST" });
    if (!response.ok) return;
    const data = await response.json();
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              likeCount: data.likeCount ?? item.likeCount,
              dislikeCount: data.dislikeCount ?? item.dislikeCount,
            }
          : item
      )
    );
  };

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="text-3xl font-semibold">Gallery</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Browse the latest uploads.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const isImage = Boolean(item.isImage);
            const fileUrl = `/api/files/${item.id}`;
            return (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium line-clamp-1">
                        {item.originalName}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {item.mimeType} · {formatBytes(item.sizeBytes)}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a href={fileUrl} download>
                        Download
                      </a>
                    </Button>
                  </div>
                  <div className="flex items-center justify-between text-xs text-neutral-600">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded border border-neutral-200 px-2 py-1 text-xs hover:bg-neutral-100"
                      onClick={() => updateVote(item.id, "like")}
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
                        <path d="M7 10v12" />
                        <path d="M15 5l-4 5v12h6.4a2 2 0 0 0 1.9-1.4l2-7a2 2 0 0 0-1.9-2.6H11" />
                        <path d="M7 10a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2" />
                      </svg>
                      <span>{item.likeCount ?? 0}</span>
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded border border-neutral-200 px-2 py-1 text-xs hover:bg-neutral-100"
                      onClick={() => updateVote(item.id, "dislike")}
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
                        <path d="M17 14V2" />
                        <path d="M9 19l4-5V2H6.6a2 2 0 0 0-1.9 1.4l-2 7A2 2 0 0 0 4.6 13H13" />
                        <path d="M17 14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2" />
                      </svg>
                      <span>{item.dislikeCount ?? 0}</span>
                    </button>
                  </div>
                  {isImage ? (
                    <button
                      className="w-full overflow-hidden rounded-md border border-neutral-200 bg-neutral-50"
                      onClick={() => setSelected(item)}
                    >
                      <div
                        className="w-full"
                        style={{ aspectRatio: "1 / 1" }}
                      >
                        <img
                          alt={item.originalName}
                          src={fileUrl}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </button>
                  ) : (
                    <div className="rounded-md border border-dashed border-neutral-200 bg-neutral-50 px-3 py-8 text-center text-sm text-neutral-500">
                      No preview available
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Dialog open={Boolean(selected)} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selected?.originalName}</DialogTitle>
          </DialogHeader>
          {selected ? (
            <img
              alt={selected.originalName}
              src={`/api/files/${selected.id}`}
              className="max-h-[70vh] w-full rounded-md object-contain"
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </main>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(240,240,240,1),_rgba(255,255,255,0))] px-6 py-16">
      <div className="mx-auto max-w-5xl space-y-12">
        <section className="space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
            File Gallery
          </p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            A clean home for your uploads
          </h1>
          <p className="max-w-2xl text-base text-neutral-600">
            Browse a curated gallery of mixed files and manage uploads from a
            protected admin workspace. Built with Next.js, shadcn/ui, and
            SQLite.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/gallery">View Gallery</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/login">Admin Login</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Mixed file support",
              text: "Images, PDFs, and archives live side-by-side with rich metadata.",
            },
            {
              title: "Fast admin workflow",
              text: "Drag-and-drop multi-upload, hide or restore files instantly.",
            },
            {
              title: "Docker-first",
              text: "Run everything locally with persistent storage on volumes.",
            },
          ].map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-600">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}

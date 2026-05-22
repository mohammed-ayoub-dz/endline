// app/help/page.tsx
"use client";

import { useState, useEffect, JSX } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu } from "@hugeicons/core-free-icons";

type ContentBlock =
  | { type: "heading"; level: 1 | 2 | 3 | 4; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "code"; language?: string; code: string }
  | { type: "blockquote"; text: string }
  | { type: "table"; headers: string[]; rows: string[][] };

interface HelpArticle {
  slug: string;
  title: string;
  content: ContentBlock[];
}


function TypographyRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "heading":
            const HeadingTag = `h${block.level}` as keyof JSX.IntrinsicElements;
            return (
              <HeadingTag
                key={idx}
                className={cn(
                  "scroll-m-20 font-semibold tracking-tight",
                  block.level === 1 && "text-4xl font-extrabold text-balance",
                  block.level === 2 && "mt-10 border-b pb-2 text-3xl first:mt-0",
                  block.level === 3 && "mt-8 text-2xl",
                  block.level === 4 && "text-xl"
                )}
              >
                {block.text}
              </HeadingTag>
            );
          case "paragraph":
            return (
              <p key={idx} className="leading-7 [&:not(:first-child)]:mt-6">
                {block.text}
              </p>
            );
          case "list":
            const ListTag = block.ordered ? "ol" : "ul";
            return (
              <ListTag key={idx} className="my-6 ml-6 list-disc [&>li]:mt-2">
                {block.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ListTag>
            );
          case "code":
            return (
              <div key={idx} className="relative my-6 rounded-lg bg-muted overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-muted/10 text-gray-300 text-xs">
                  <span>{block.language || "code"}</span>
                </div>
                <pre className="p-4 overflow-x-auto text-sm">
                  <code>{block.code}</code>
                </pre>
              </div>
            );
          case "blockquote":
            return (
              <blockquote key={idx} className="mt-6 border-l-2 pl-6 italic">
                {block.text}
              </blockquote>
            );
          case "table":
            return (
              <div key={idx} className="my-6 w-full overflow-y-auto">
                <table className="w-full">
                  <thead>
                    <tr className="m-0 border-t p-0 even:bg-muted">
                      {block.headers.map((h, i) => (
                        <th key={i} className="border px-4 py-2 text-left font-bold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, i) => (
                      <tr key={i} className="m-0 border-t p-0 even:bg-muted">
                        {row.map((cell, j) => (
                          <td key={j} className="border px-4 py-2 text-left">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

function HelpSidebar({
  articles,
  activeSlug,
  onSelect,
}: {
  articles: HelpArticle[];
  activeSlug: string;
  onSelect: (slug: string) => void;
}) {
  return (
    <nav className="space-y-1">
      {articles.map((article) => (
        <button
          key={article.slug}
          onClick={() => onSelect(article.slug)}
          className={cn(
            "block w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
            activeSlug === article.slug
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {article.title}
        </button>
      ))}
    </nav>
  );
}

export default function HelpPage() {
  const [articles, setArticles] = useState<HelpArticle[]>([]);
  const [activeArticle, setActiveArticle] = useState<HelpArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);


  useEffect(() => {
    async function fetchManifest() {
      try {
        const res = await fetch("/help/manifest.json");
        const manifest: { slug: string; title: string }[] = await res.json();
        const loadedArticles: HelpArticle[] = [];
        for (const item of manifest) {
          const contentRes = await fetch(`/help/${item.slug}.json`);
          const content: ContentBlock[] = await contentRes.json();
          loadedArticles.push({ ...item, content });
        }
        setArticles(loadedArticles);
        if (loadedArticles.length > 0) {
          setActiveArticle(loadedArticles[0]);
        }
      } catch (error) {
        console.error("Failed to load help articles", error);
      } finally {
        setLoading(false);
      }
    }
    fetchManifest();
  }, []);

  const selectArticle = (slug: string) => {
    const article = articles.find((a) => a.slug === slug);
    if (article) {
      setActiveArticle(article);
      setMobileOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">

      <div className="sticky top-0 z-20 flex h-14 items-center border-b bg-background/95 px-4 md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <HugeiconsIcon icon={Menu}/>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-4">
            <HelpSidebar articles={articles} activeSlug={activeArticle?.slug || ""} onSelect={selectArticle} />
          </SheetContent>
        </Sheet>
        <div className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Endline
        </div>
      </div>

      <div className="container py-8 md:py-12 p-4">
        <div className="flex flex-col gap-8 md:flex-row">
          <aside className="hidden w-64 shrink-0 md:block">
            <div className="sticky top-20">
 <div className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Endline مساعد
        </div>              <HelpSidebar
                articles={articles}
                activeSlug={activeArticle?.slug || ""}
                onSelect={selectArticle}
              />
            </div>
          </aside>
          <main className="flex-1 min-w-0">
            {activeArticle ? (
              <>
                <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight text-balance">
                  {activeArticle.title}
                </h1>
                <TypographyRenderer blocks={activeArticle.content} />
              </>
            ) : (
              <p className="text-muted-foreground">Select an article from the sidebar.</p>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
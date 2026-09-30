"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { EMPLOYER_COPY, servicePaths } from "@/lib/content/employers";
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const { lang, t } = useLanguage();
  const copy = EMPLOYER_COPY[lang];
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Menü öffnen"
          className="h-11 w-11 flex items-center justify-center rounded-lg border"
        >
          <Menu className="w-5 h-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.header.solutions}</DialogTitle>
          <DialogDescription>DMF Talents</DialogDescription>
        </DialogHeader>
        <nav aria-label="Mobile Navigation" className="flex flex-col gap-1">
          {(Object.keys(servicePaths) as (keyof typeof servicePaths)[]).map((key) => (
            <Link
              key={key}
              href={servicePaths[key]}
              onClick={() => setOpen(false)}
              className="min-h-12 p-3 rounded-lg hover:bg-secondary font-medium"
            >
              {copy.form.services[key]}
            </Link>
          ))}
          <Link
            href="/fuer-arbeitgeber/kandidaten"
            onClick={() => setOpen(false)}
            className="min-h-12 p-3 border-t"
          >
            {copy.secondary}
          </Link>
          <Link href="/#about" onClick={() => setOpen(false)} className="min-h-12 p-3">
            {t.header.about}
          </Link>
          <Link href="/blog" onClick={() => setOpen(false)} className="min-h-12 p-3">
            Blog
          </Link>
          <Link
            href="/fuer-arbeitgeber/personalbedarf"
            onClick={() => setOpen(false)}
            className="min-h-12 p-3 rounded-lg bg-primary text-primary-foreground text-center font-semibold mt-3"
          >
            {copy.primary}
          </Link>
        </nav>
      </DialogContent>
    </Dialog>
  );
}

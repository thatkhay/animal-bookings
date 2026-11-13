import Link from "next/link";
import { Phone, X } from "lucide-react";
import { Logo } from "@/components/shared/logo";

export default function BookLayout({ children }: LayoutProps<"/book">) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-mint-50">
      <header className="sticky top-0 z-30 border-b border-mint-200 bg-mint-50/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <div className="flex items-center gap-2">
            <a
              href="tel:+15025550100"
              className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink-600 hover:text-ink-900 sm:flex"
            >
              <Phone className="size-4" /> (502) 555-0100
            </a>
            <Link
              href="/"
              className="grid size-10 place-items-center rounded-xl text-ink-600 hover:bg-ink-900/5 hover:text-ink-900"
              aria-label="Leave booking"
            >
              <X className="size-5" />
            </Link>
          </div>
        </div>
      </header>
      <main id="main" className="flex-1">
        {children}
      </main>
    </div>
  );
}

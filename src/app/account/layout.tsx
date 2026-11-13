import { Bell, Plus } from "lucide-react";
import { AccountNav } from "@/components/account/account-nav";
import { Logo } from "@/components/shared/logo";
import { MobileTabBar } from "@/components/shared/mobile-tab-bar";
import { SiteFooter } from "@/components/site/site-footer";
import { ButtonLink } from "@/components/ui/button";
import { getCurrentClient } from "@/lib/api";
import { initials } from "@/lib/utils";

export default async function AccountLayout({ children }: LayoutProps<"/account">) {
  const client = await getCurrentClient();

  return (
    <div className="flex min-h-full flex-1 flex-col pb-tabbar lg:pb-0">
      <header className="pt-safe sticky top-0 z-30 border-b border-mint-200 bg-mint-50/85 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between gap-4 lg:h-16">
            <Logo />
            <div className="flex items-center gap-2">
              <ButtonLink href="/book" size="sm" className="hidden lg:inline-flex">
                <Plus className="size-4" /> Book a visit
              </ButtonLink>
              <button
                type="button"
                className="relative grid size-9 place-items-center rounded-xl text-ink-600 hover:bg-ink-900/5"
                aria-label="Notifications (2 new)"
              >
                <Bell className="size-[18px]" />
                <span className="absolute top-2 right-2 size-2 rounded-full bg-coral-500 ring-2 ring-mint-50" />
              </button>
              <span
                className="grid size-9 place-items-center rounded-full bg-ink-900 font-mono text-xs font-medium text-white"
                title={client.name}
              >
                {initials(client.name)}
              </span>
            </div>
          </div>
          <div className="hidden lg:block">
            <AccountNav />
          </div>
        </div>
      </header>
      <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:py-12">
        {children}
      </main>
      <SiteFooter />
      <MobileTabBar variant="account" className="lg:hidden" />
    </div>
  );
}

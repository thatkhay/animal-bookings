import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";

export default function NotFound() {
  return (
    <main id="main" className="grid flex-1 place-items-center px-4 py-24">
      <div className="text-center">
        <Logo />
        <p className="mt-10 font-mono text-[11px] tracking-[0.18em] text-teal-700 uppercase">404 · Off route</p>
        <h1 className="mt-3 font-display text-6xl leading-none font-bold uppercase sm:text-7xl">This street isn&apos;t on a lane</h1>
        <p className="mx-auto mt-4 max-w-md text-ink-500">The page you were looking for doesn&apos;t exist or has moved.</p>
        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink href="/" variant="dark">Back home</ButtonLink>
          <ButtonLink href="/book" variant="outline">Book a visit</ButtonLink>
        </div>
      </div>
    </main>
  );
}

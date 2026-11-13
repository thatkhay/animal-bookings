import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pawlane — Neighborhood pet care",
    short_name: "Pawlane",
    description: "Book walks, puppy sessions and drop-ins on your neighborhood lane.",
    start_url: "/account",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f3faf8",
    theme_color: "#f3faf8",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Book a visit", url: "/book" },
      { name: "My pets", url: "/account/pets" },
    ],
  };
}

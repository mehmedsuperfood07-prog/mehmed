import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mehmed Super Foods",
    short_name: SITE_NAME,
    description: "Quality Food for a Healthier Tomorrow",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1b7a3e",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}

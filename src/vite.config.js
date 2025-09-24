import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    VitePWA({
      // This tells the plugin to generate a service worker file
      registerType: "autoUpdate",

      // Include all your static assets in the cache manifest
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "assets/1-CFSqmNPB.webp",
        "assets/2-CFSqmNPB.webp",
        "assets/3-CFSqmNPB.webp",
        "assets/4-CFSqmNPB.webp",
        "/src/css/index.css",
      ],

      manifest: {
        name: "Sarah & Andras Wedding",
        short_name: "Our Wedding",
        description:
          "A personal app for our wedding guests. Find all the information you need, play games, and share memories.",
        theme_color: "#f43f5e",
        icons: [
          // These are the icons you provided earlier, but you must make sure
          // their paths are correct in your final project folder.
          {
            src: "android-launchericon-192-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "android-launchericon-512-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});

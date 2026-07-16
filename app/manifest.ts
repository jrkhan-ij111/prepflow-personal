import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PrepFlow - Personal Study Assistant",
    short_name: "PrepFlow",
    description:
      "PrepFlow is a personal study management app for BCS preparation, MCQ practice, revision tracking and productivity.",

    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",

    background_color: "#0B0B0F",
    theme_color: "#0B0B0F",

    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],

    shortcuts: [
      {
        name: "Learn",
        short_name: "Learn",
        description: "Continue your BCS lessons",
        url: "/learn",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
      {
        name: "Revision Bank",
        short_name: "Revision",
        description: "Practice MCQ revision",
        url: "/revision",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
      {
        name: "Library",
        short_name: "Library",
        description: "Open your BCS book library",
        url: "/library",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
    ],

    screenshots: [
      {
        src: "/screenshots/wide.png",
        sizes: "1350x2850",
        type: "image/png",
        form_factor: "wide",
      },
      {
        src: "/screenshots/narrow.png",
        sizes: "1678x3840",
        type: "image/png",
        form_factor: "narrow",
      },
    ],
  };
}
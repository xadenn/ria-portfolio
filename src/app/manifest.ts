import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ria Verma — Design Engineer & Brand Designer",
    short_name: "Ria Verma",
    description: "Multidisciplinary UI/UX & Brand Designer with 2+ Years Experience.",
    start_url: "/",
    display: "standalone",
    background_color: "#0C0C0C",
    theme_color: "#0C0C0C",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}

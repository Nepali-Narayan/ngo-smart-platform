import type { MetadataRoute } from "next";
import { getPublished } from "@/lib/site-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const [programs, projects, posts] = await Promise.all([
    getPublished("programs", 100), getPublished("projects", 100), getPublished("posts", 100)
  ]);
  const pages = ["", "/about", "/programs", "/projects", "/news", "/gallery", "/volunteer", "/donate", "/contact"];
  return [
    ...pages.map(path => ({ url: `${base.replace(/\/$/, "")}${path}`, lastModified: new Date() })),
    ...programs.map(x => ({ url: `${base.replace(/\/$/, "")}/programs/${x.slug}`, lastModified: new Date(x.updated_at || x.created_at) })),
    ...projects.map(x => ({ url: `${base.replace(/\/$/, "")}/projects/${x.slug}`, lastModified: new Date(x.updated_at || x.created_at) })),
    ...posts.map(x => ({ url: `${base.replace(/\/$/, "")}/news/${x.slug}`, lastModified: new Date(x.updated_at || x.created_at) })),
  ];
}

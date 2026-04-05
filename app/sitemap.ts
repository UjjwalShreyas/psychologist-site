import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://sumakavitha.online", lastModified: new Date() },
    { url: "https://sumakavitha.online/about", lastModified: new Date() },
    { url: "https://sumakavitha.online/services", lastModified: new Date() },
    { url: "https://sumakavitha.online/gallery", lastModified: new Date() },
    { url: "https://sumakavitha.online/contact", lastModified: new Date() },
  ];
}

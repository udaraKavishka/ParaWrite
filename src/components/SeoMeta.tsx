import { useEffect } from "react";

interface SeoMetaProps {
  title: string;
  description: string;
  path: string;
}

const BASE_URL = "https://parawrite.udaradev.me";

const upsertMeta = (selector: string, attrs: Record<string, string>) => {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attrs).forEach(([key, value]) => {
    element!.setAttribute(key, value);
  });
};

const upsertLink = (selector: string, attrs: Record<string, string>) => {
  let element = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }

  Object.entries(attrs).forEach(([key, value]) => {
    element!.setAttribute(key, value);
  });
};

const SeoMeta = ({ title, description, path }: SeoMetaProps) => {
  useEffect(() => {
    const absoluteUrl = `${BASE_URL}${path}`;

    document.title = title;
    upsertMeta("meta[name='description']", { name: "description", content: description });
    upsertMeta("meta[name='robots']", {
      name: "robots",
      content: "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
    });

    upsertMeta("meta[property='og:title']", { property: "og:title", content: title });
    upsertMeta("meta[property='og:description']", { property: "og:description", content: description });
    upsertMeta("meta[property='og:url']", { property: "og:url", content: absoluteUrl });
    upsertMeta("meta[property='og:type']", { property: "og:type", content: "website" });
    upsertMeta("meta[property='og:site_name']", { property: "og:site_name", content: "ParaWrite" });

    upsertLink("link[rel='canonical']", { rel: "canonical", href: absoluteUrl });
  }, [description, path, title]);

  return null;
};

export default SeoMeta;

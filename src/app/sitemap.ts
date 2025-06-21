import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.yourdomain.com';

  const routes = ['', '/about', '/projects', '/resume', '/leadership', '/contact'];

  const routeEntries = routes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  return [
    ...routeEntries,
  ];
} 
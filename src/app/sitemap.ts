import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://lumina-tools.com';
  const locales = ['en', 'ja'];

  const paths = [
    { path: '', priority: 1.0 }, // Root path
    { path: '/tools/image', priority: 0.8 },
    { path: '/tools/video', priority: 0.8 },
    { path: '/tools/pdf', priority: 0.8 },
    { path: '/tools/audio', priority: 0.8 },
    { path: '/tools/ai', priority: 0.8 },
    { path: '/tools/qr', priority: 0.8 },
    { path: '/tools/text', priority: 0.8 },
    { path: '/tools/dev', priority: 0.8 },
    { path: '/tools/archive', priority: 0.8 },
    { path: '/tools/recorder', priority: 0.8 },
    { path: '/about', priority: 0.5 },
    { path: '/settings', priority: 0.5 },
  ];

  const sitemapData: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const { path, priority } of paths) {
      sitemapData.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: priority,
      });
    }
  }

  return sitemapData;
}

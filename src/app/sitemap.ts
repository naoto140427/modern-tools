import { MetadataRoute } from 'next';
import { NEXT_PUBLIC_APP_URL } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['ja', 'en'];
  const routes = [
    '', // Home
    '/tools/image',
    '/tools/video',
    '/tools/pdf',
    '/tools/audio',
    '/tools/ai',
    '/tools/qr',
    '/tools/text',
    '/tools/dev',
    '/tools/archive',
    '/tools/recorder',
    '/about',
    '/settings',
    '/feedback'
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  locales.forEach(locale => {
    routes.forEach(route => {
      sitemapEntries.push({
        url: `${NEXT_PUBLIC_APP_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : route.startsWith('/tools') ? 0.8 : 0.5,
      });
    });
  });

  return sitemapEntries;
}

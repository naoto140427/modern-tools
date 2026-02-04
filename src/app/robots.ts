import { MetadataRoute } from 'next';
import { NEXT_PUBLIC_APP_URL } from '@/lib/constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${NEXT_PUBLIC_APP_URL}/sitemap.xml`,
  };
}

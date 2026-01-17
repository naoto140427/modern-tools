import { getRequestConfig } from 'next-intl/server';
 
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
 
  if (!locale || !['en', 'ja'].includes(locale)) {
    locale = 'ja'; // デフォルトは日本語
  }
 
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
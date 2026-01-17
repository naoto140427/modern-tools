import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  // 対応する言語リスト
  locales: ['en', 'ja'],
 
  // デフォルト言語
  defaultLocale: 'ja'
});
 
export const config = {
  // next.jsの内部ファイルや画像ファイル以外すべてにマッチさせる呪文
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
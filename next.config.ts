import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

// i18nの設定ファイルを読み込む
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  /* ここに将来設定を追加していきます */
};

// プラグインを適用してエクスポート
export default withNextIntl(nextConfig);
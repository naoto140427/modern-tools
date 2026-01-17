import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import withPWAInit from "@ducanh2912/next-pwa"; // 👈 ここを require から import に変更

// 1. PWAの設定
const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

// 2. 多言語化の設定
const withNextIntl = createNextIntlPlugin();

// 3. 基本設定 ＆ バージョン情報の埋め込み
const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || "1.0.0",
  },
};

// 4. 全部合体させてエクスポート
export default withPWA(withNextIntl(nextConfig));
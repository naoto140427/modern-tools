// src/config/newsroom.ts
export type NewsCategory = "guide" | "update" | "tech";

export type NewsPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: NewsCategory;
  image: string; // publicフォルダのパス
  featured?: boolean; // トップに大きく表示するか
  content: Array<{
    type: "paragraph" | "heading" | "list" | "code" | "image" | "note";
    content: string | string[];
    level?: 1 | 2 | 3;
    src?: string; // For images
    alt?: string; // For images
  }>;
};

export const newsPosts: Record<string, NewsPost[]> = {
  ja: [
    {
      slug: "launch-lumina-studio",
      title: "Lumina Studioへようこそ：プライバシーファーストの新しいWebツール",
      excerpt: "サーバーへのアップロード不要。あなたのブラウザだけで動く、画像・動画・PDF編集ツールのスイートがついに公開されました。",
      date: "2024-02-05",
      category: "update",
      featured: true,
      image: "/blog/launch-hero.jpg",
      content: [
        { type: "paragraph", content: "本日、私たちはLumina Studioを正式にリリースしました。これは単なる便利ツールではありません。あなたのプライバシーを守るための挑戦です。" },
        { type: "heading", content: "v1.0 リリースノート", level: 2 },
        { type: "list", content: ["Image Lab: HEIC対応の画像変換", "Video Lab: FFmpeg WASMによる動画編集", "PDF Lab: 結合・分割機能", "完全オフライン対応 (PWA)"] },
        { type: "note", content: "Luminaは現在、全ての機能を無料で提供しています。" }
      ]
    },
    {
      slug: "how-to-convert-heic",
      title: "iPhoneのHEIC写真をWindowsで開く最も安全な方法",
      excerpt: "専用ソフトのインストールは不要。ドラッグ＆ドロップするだけで、高画質のままJPGに変換できます。",
      date: "2024-02-04",
      category: "guide",
      featured: false,
      image: "/blog/heic-guide.jpg",
      content: [
        { type: "paragraph", content: "iPhoneの写真（HEIC）がPCで開けなくて困っていませんか？Lumina Image Labを使えば、一瞬で解決します。" },
        { type: "heading", content: "手順はこれだけ", level: 2 },
        { type: "list", content: ["1. Image Labを開く", "2. 写真をドロップ", "3. 形式を選んでダウンロード"] }
      ]
    },
    {
      slug: "privacy-architecture",
      title: "なぜ「サーバーレス」が最強のセキュリティなのか",
      excerpt: "あなたのファイルは、あなたのデバイスから一歩も外に出ません。WebAssembly技術の裏側を解説します。",
      date: "2024-02-03",
      category: "tech",
      featured: false,
      image: "/blog/security.jpg",
      content: [
        { type: "paragraph", content: "従来のオンラインツールは、ファイルを一度サーバーに送る必要がありました。しかしLuminaは違います。" },
        { type: "heading", content: "Local First という考え方", level: 2 },
        { type: "paragraph", content: "私たちはブラウザそのものを「加工場」にしました。これにより、通信傍受のリスクは理論上ゼロになります。" }
      ]
    }
  ],
  en: [
    {
      slug: "launch-lumina-studio",
      title: "Introducing Lumina Studio: The Privacy-First Web Suite",
      excerpt: "No server uploads. Edit images, videos, and PDFs entirely in your browser.",
      date: "2024-02-05",
      category: "update",
      featured: true,
      image: "/blog/launch-hero.jpg",
      content: [
         { type: "paragraph", content: "Today, we are thrilled to announce Lumina Studio. It is not just a tool, but a commitment to your privacy." },
         { type: "heading", content: "v1.0 Release Notes", level: 2 },
         { type: "list", content: ["Image Lab: HEIC Support", "Video Lab: FFmpeg WASM", "PDF Lab: Merge & Split", "Fully Offline Capable (PWA)"] },
         { type: "note", content: "Lumina is currently free for all features." }
      ]
    },
    {
      slug: "how-to-convert-heic",
      title: "The Safest Way to Open iPhone HEIC Photos on Windows",
      excerpt: "No software installation needed. Just drag and drop to convert to JPG with high quality.",
      date: "2024-02-04",
      category: "guide",
      featured: false,
      image: "/blog/heic-guide.jpg",
      content: [
        { type: "paragraph", content: "Struggling to open iPhone photos (HEIC) on your PC? Lumina Image Lab solves it instantly." },
        { type: "heading", content: "Just 3 Steps", level: 2 },
        { type: "list", content: ["1. Open Image Lab", "2. Drop photos", "3. Select format and download"] }
      ]
    },
    {
      slug: "privacy-architecture",
      title: "Why Serverless is the Ultimate Security",
      excerpt: "Your files never leave your device. Explaining the WebAssembly technology behind it.",
      date: "2024-02-03",
      category: "tech",
      featured: false,
      image: "/blog/security.jpg",
      content: [
        { type: "paragraph", content: "Traditional online tools required sending files to a server. Lumina is different." },
        { type: "heading", content: "Local First Philosophy", level: 2 },
        { type: "paragraph", content: "We turned the browser itself into a 'factory'. This theoretically eliminates the risk of interception." }
      ]
    }
  ]
};

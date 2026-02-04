export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: "guide" | "update" | "tech";
  readTime: string;
  image: string; // Path to image in public folder
  content: Array<{
    type: "paragraph" | "heading" | "list" | "code" | "image";
    content: string | string[];
    level?: 1 | 2 | 3; // For headings
    src?: string; // For images
    alt?: string; // For images
    language?: string; // For code blocks
  }>;
};

export const blogPosts: Record<string, BlogPost[]> = {
  ja: [
    {
      slug: "convert-heic-to-jpg",
      title: "iPhoneのHEIC写真をJPGに変換する最も簡単な方法【インストール不要】",
      excerpt: "WindowsでiPhoneの写真が開けない？Lumina Image Labなら、アプリのインストールなしで、ブラウザだけで安全にHEICをJPG/PNGに変換できます。",
      date: "2024-02-05",
      category: "guide",
      readTime: "3 min read",
      image: "/blog/heic-converter.jpg",
      content: [
        {
          type: "paragraph",
          content: "iPhoneで撮影した写真（HEIC形式）がWindowsやAndroidで開けなくて困ったことはありませんか？通常は変換ソフトをインストールする必要がありますが、Lumina Studioならその必要はありません。"
        },
        { type: "heading", content: "なぜLumina Image Labが安全なのか？", level: 2 },
        {
          type: "paragraph",
          content: "多くのオンライン変換サイトは、あなたの写真を一度サーバーにアップロードします。しかし、Luminaは「WebAssembly」という技術を使い、**あなたのブラウザの中だけで**変換処理を行います。写真が外部に送信されることは一切ありません。"
        },
        { type: "heading", content: "使い方は3ステップだけ", level: 2 },
        {
          type: "list",
          content: [
            "1. Image Labを開く",
            "2. HEIC写真をドラッグ＆ドロップ",
            "3. JPGまたはPNGを選んでダウンロード"
          ]
        },
        {
          type: "paragraph",
          content: "今すぐ下のリンクから試してみてください。画質の劣化もありません。"
        }
      ]
    }
  ],
  en: [
    {
      slug: "convert-heic-to-jpg",
      title: "How to Convert HEIC to JPG Without Installing Software",
      excerpt: "Can't open iPhone photos on Windows? Use Lumina Image Lab to convert HEIC to JPG/PNG securely in your browser.",
      date: "2024-02-05",
      category: "guide",
      readTime: "3 min read",
      image: "/blog/heic-converter.jpg",
      content: [
        { type: "paragraph", content: "Struggling to open HEIC photos on Windows? No need to install shady software. Lumina Studio handles everything locally." },
        { type: "heading", content: "Why is it secure?", level: 2 },
        { type: "paragraph", content: "Unlike other sites, Lumina uses WebAssembly to process images **inside your browser**. Your photos never leave your device." },
        { type: "heading", content: "3 Simple Steps", level: 2 },
        {
            type: "list",
            content: [
                "1. Open Image Lab",
                "2. Drag & Drop HEIC photos",
                "3. Select JPG or PNG and Download"
            ]
        },
        {
            type: "paragraph",
            content: "Try it now from the link below. No quality loss."
        }
      ]
    }
  ]
};

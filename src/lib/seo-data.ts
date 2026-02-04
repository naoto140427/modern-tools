export type SeoInfo = {
  title: string;
  description: string;
  keywords: string[];
};

export const seoData: Record<string, Record<string, SeoInfo>> = {
  image: {
    en: {
      title: "Image Lab - Secure Image Converter & Compressor",
      description: "Convert HEIC to JPG, compress PNG, and edit images locally in your browser. No server uploads, 100% private.",
      keywords: ["image converter", "heic to jpg", "image compressor", "privacy focused"],
    },
    ja: {
      title: "Image Lab - 画像変換・圧縮・編集ツール",
      description: "HEICからJPGへの変換、画像の圧縮、編集をブラウザ上で完結。サーバーへのアップロードなしで、プライバシーを完全に保護します。",
      keywords: ["画像変換", "HEIC変換", "画像圧縮", "ブラウザツール", "プライバシー"],
    },
  },
  video: {
    en: {
      title: "Video Lab - Private Video Converter & Editor",
      description: "Transcode video formats (MP4, WebM), compress files, and extract audio. Serverless FFmpeg processing for ultimate privacy.",
      keywords: ["video converter", "mp4 converter", "ffmpeg wasm", "video compressor"],
    },
    ja: {
      title: "Video Lab - 動画変換・編集ツール",
      description: "MP4やWebMへのフォーマット変換、動画圧縮、音声抽出をブラウザのみで実行。FFmpeg WASMによる高速かつ安全な処理。",
      keywords: ["動画変換", "動画圧縮", "音声抽出", "FFmpeg", "サーバーレス"],
    },
  },
  pdf: {
    en: {
      title: "PDF Lab - Merge & Organize PDFs",
      description: "Merge multiple PDF files into one securely in your browser. Drag and drop interface for easy organization.",
      keywords: ["pdf merge", "combine pdf", "pdf organizer", "client-side pdf"],
    },
    ja: {
      title: "PDF Lab - PDF結合・整理ツール",
      description: "複数のPDFファイルをブラウザ上で安全に結合。ドラッグ＆ドロップで簡単にページ順序を整理できます。",
      keywords: ["PDF結合", "PDFマージ", "PDF整理", "ブラウザ完結"],
    },
  },
  audio: {
    en: {
      title: "Audio Lab - Converter & Visualizer",
      description: "Convert audio files (MP3, WAV, AAC) and visualize waveforms. Runs entirely in your browser using WebAssembly.",
      keywords: ["audio converter", "mp3 converter", "waveform visualizer", "ffmpeg audio"],
    },
    ja: {
      title: "Audio Lab - 音声変換・可視化ツール",
      description: "MP3、WAV、AACなどの音声ファイルを変換し、波形を可視化。WebAssemblyを使用してブラウザ内で処理します。",
      keywords: ["音声変換", "MP3変換", "波形表示", "オーディオツール"],
    },
  },
  ai: {
    en: {
      title: "AI Lab - Background Remover",
      description: "Remove image backgrounds automatically using AI. Client-side processing ensures your photos never leave your device.",
      keywords: ["background remover", "ai image tool", "remove background", "client-side ai"],
    },
    ja: {
      title: "AI Lab - 背景削除ツール",
      description: "AIを使用して画像の背景を自動的に削除。クライアントサイド処理により、写真はデバイスから送信されません。",
      keywords: ["背景削除", "AI画像処理", "背景透過", "プライバシー保護"],
    },
  },
  qr: {
    en: {
      title: "QR Master - Custom QR Code Generator",
      description: "Generate custom QR codes with logos and colors. Export to SVG or PNG instantly.",
      keywords: ["qr code generator", "custom qr", "qr with logo", "qr code maker"],
    },
    ja: {
      title: "QR Master - カスタムQRコード作成",
      description: "ロゴや色をカスタマイズ可能なQRコードを作成。SVGまたはPNG形式で即座にエクスポート。",
      keywords: ["QRコード作成", "カスタムQR", "QRコード生成", "ロゴ入りQR"],
    },
  },
  text: {
    en: {
      title: "Text Lab - Word Counter & Converter",
      description: "Real-time character and word counting, text conversion, and Lorem Ipsum generation. Simple and efficient.",
      keywords: ["word counter", "character count", "text converter", "lorem ipsum generator"],
    },
    ja: {
      title: "Text Lab - 文字数カウント・変換ツール",
      description: "リアルタイムの文字数・単語数カウント、テキスト変換、Lorem Ipsum生成。シンプルで効率的なテキストツール。",
      keywords: ["文字数カウント", "単語数", "テキスト変換", "ダミーテキスト生成"],
    },
  },
  dev: {
    en: {
      title: "Dev Lab - Developer Utilities",
      description: "Essential tools for developers including JSON formatter, Base64 encoder/decoder, and secure password generator.",
      keywords: ["json formatter", "base64 converter", "password generator", "developer tools"],
    },
    ja: {
      title: "Dev Lab - 開発者向けツールセット",
      description: "JSONフォーマッター、Base64エンコード/デコード、安全なパスワード生成など、開発者に必須のツール群。",
      keywords: ["JSON整形", "Base64変換", "パスワード生成", "開発ツール"],
    },
  },
  archive: {
    en: {
      title: "Archive Lab - Compression Tool",
      description: "Create and extract ZIP archives directly in your browser. Fast and secure file compression.",
      keywords: ["zip creator", "unzip online", "file compression", "archive tool"],
    },
    ja: {
      title: "Archive Lab - 圧縮・解凍ツール",
      description: "ブラウザ上で直接ZIPアーカイブを作成・解凍。高速かつ安全なファイル圧縮ツール。",
      keywords: ["ZIP作成", "ZIP解凍", "ファイル圧縮", "アーカイブ"],
    },
  },
  recorder: {
    en: {
      title: "Screen Recorder - Browser Screen Capture",
      description: "Record your screen or camera with high quality. Save recordings as WebM or MP4 without installing software.",
      keywords: ["screen recorder", "screen capture", "browser recorder", "video recording"],
    },
    ja: {
      title: "Screen Recorder - 画面録画・キャプチャ",
      description: "画面やカメラを高品質で録画。ソフトウェアのインストールなしで、録画をWebMまたはMP4として保存。",
      keywords: ["画面録画", "スクリーンキャプチャ", "ブラウザ録画", "動画キャプチャ"],
    },
  },
};

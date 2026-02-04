import { BlogPost } from "@/types/blog";

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-use-image-lab",
    title: "Image Labの使い方ガイド",
    description: "ブラウザだけで完結するセキュアな画像変換・圧縮ツールの便利な使い方を紹介します。",
    date: "2024-03-15",
    author: "Lumina Studio Team",
    tags: ["Guide", "Image Lab", "Tips"],
    content: [
      {
        type: "paragraph",
        content: "Lumina StudioのImage Labへようこそ。このツールを使えば、画像をサーバーにアップロードすることなく、ブラウザ上で安全に変換や圧縮を行うことができます。今回は、その基本的な使い方と便利な機能をご紹介します。",
      },
      {
        type: "heading",
        level: 2,
        content: "1. 画像の追加方法",
      },
      {
        type: "paragraph",
        content: "使い方はとてもシンプルです。変換したい画像をドラッグ＆ドロップエリアに放り込むだけ。もちろん、クリックしてファイル選択ダイアログから選ぶことも可能です。",
      },
      {
        type: "heading",
        level: 2,
        content: "2. フォーマット変換",
      },
      {
        type: "paragraph",
        content: "iPhoneで撮影したHEIC形式の写真を、汎用性の高いJPEGやPNGに変換したいと思ったことはありませんか？Image Labなら、アップロードの待ち時間なしで瞬時に変換できます。WebPへの変換にも対応しており、Webサイトの高速化にも役立ちます。",
      },
      {
        type: "heading",
        level: 2,
        content: "3. 画像圧縮",
      },
      {
        type: "paragraph",
        content: "画質を維持したままファイルサイズを小さくしたい場合、圧縮機能が便利です。スライダーを動かして品質を調整し、リアルタイムでプレビューを確認できます。",
      },
      {
        type: "heading",
        level: 2,
        content: "4. プライバシーについて",
      },
      {
        type: "paragraph",
        content: "Lumina Studioの最大の特徴は「プライバシーファースト」です。全ての処理はあなたのデバイス（ブラウザ）内で行われます。画像データが外部のサーバーに送信されることは一切ありませんので、機密性の高い画像でも安心して扱うことができます。",
      },
    ],
  },
];

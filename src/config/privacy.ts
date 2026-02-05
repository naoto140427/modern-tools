// src/config/privacy.ts

export type PrivacySection = {
  title: string;
  content: string[]; // 段落ごとの配列
};

export const privacyPolicy: Record<string, { lastUpdated: string; sections: PrivacySection[] }> = {
  en: {
    lastUpdated: "February 5, 2026",
    sections: [
      {
        title: "1. Introduction",
        content: [
          "Welcome to Lumina Studio. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we handle your data when you use our browser-based tools (Image Lab, Video Lab, PDF Lab, etc.).",
          "Our core philosophy is 'Local-First'. Unlike traditional online tools, we do not upload your files to our servers for processing. All editing and conversion happen entirely within your device's web browser."
        ]
      },
      {
        title: "2. How We Handle Your Files (The 'No-Upload' Guarantee)",
        content: [
          "When you use our tools to process files (such as images, videos, or PDFs), the processing is performed locally on your device using WebAssembly technology.",
          "Your files never leave your device and are never transmitted to our servers or any third party. Since we do not collect or store your files, there is zero risk of data leakage from our side."
        ]
      },
      {
        title: "3. Information We Collect",
        content: [
          "**Personal Information:** We do not collect any personally identifiable information (PII) such as your name, email address, or phone number, as we do not require account registration.",
          "**Usage Data:** We use Vercel Analytics to collect anonymous usage statistics (e.g., page views, country of origin, browser type) to help us improve the performance and usability of Lumina Studio. This data is aggregated and cannot be used to identify you personally."
        ]
      },
      {
        title: "4. Cookies and Local Storage",
        content: [
          "We do not use cookies for advertising or tracking purposes.",
          "We use 'Local Storage' technology to save your preferences (such as Dark Mode settings or language selection) directly on your browser. This data is strictly necessary for the functionality of the website and is not shared with anyone."
        ]
      },
      {
        title: "5. Third-Party Services",
        content: [
          "Our website is hosted on Vercel Inc. Their privacy policy governs the infrastructure-level data collection (such as server logs for security).",
          "We may include links to external websites (e.g., GitHub). We are not responsible for the privacy practices of these external sites."
        ]
      },
      {
        title: "6. Children's Privacy",
        content: [
          "Our services are safe for users of all ages. However, we do not knowingly collect personal information from children under the age of 13."
        ]
      },
      {
        title: "7. Contact Us",
        content: [
          "If you have any questions or concerns about this Privacy Policy, please contact us via our Feedback form or through our GitHub repository."
        ]
      }
    ]
  },
  ja: {
    lastUpdated: "2026年2月5日",
    sections: [
      {
        title: "1. はじめに",
        content: [
          "Lumina Studioをご利用いただきありがとうございます。当サイトは、ユーザーのプライバシー保護を最優先事項としています。本プライバシーポリシーでは、当サイトのツール（Image Lab, Video Lab, PDF Lab等）を利用する際のデータの取り扱いについて説明します。",
          "私たちの基本理念は「Local-First（ローカルファースト）」です。従来のオンラインツールとは異なり、処理のためにファイルをサーバーへアップロードすることはありません。すべての編集・変換作業は、お客様のブラウザ内で完結します。"
        ]
      },
      {
        title: "2. ファイルの取り扱いについて（非アップロード保証）",
        content: [
          "画像、動画、PDFなどのファイルを当サイトで処理する際、その処理は「WebAssembly」技術を用いて、すべてお客様のデバイス（PCやスマートフォン）上で実行されます。",
          "お客様のファイルが当サイトのサーバーや第三者に送信されることは一切ありません。私たちはファイルを保存・閲覧することができない仕組みになっており、当サイトからの情報漏洩リスクは理論上存在しません。"
        ]
      },
      {
        title: "3. 収集する情報",
        content: [
          "**個人情報:** 当サイトは会員登録を必要としないため、氏名、メールアドレス、電話番号などの個人を特定できる情報（PII）は一切収集しません。",
          "**利用データ:** サービスの品質向上のため、Vercel Analyticsを使用して、匿名の統計データ（ページ閲覧数、アクセス元の国、ブラウザの種類など）を収集しています。これらのデータから個人が特定されることはありません。"
        ]
      },
      {
        title: "4. Cookieとローカルストレージ",
        content: [
          "広告や追跡を目的としたCookie（クッキー）は使用していません。",
          "サイトの機能維持のため（ダークモード設定や言語選択の保存など）、ブラウザの「ローカルストレージ」機能を使用しています。このデータはお客様のブラウザ内にのみ保存され、外部に送信されることはありません。"
        ]
      },
      {
        title: "5. 第三者サービス",
        content: [
          "当サイトはVercel Inc.のプラットフォーム上でホストされています。インフラレベルでのデータ収集（セキュリティのためのサーバーログ等）については、Vercelのプライバシーポリシーに準拠します。",
          "当サイトには外部サイト（GitHub等）へのリンクが含まれる場合がありますが、外部サイトのプライバシー保護については責任を負いかねます。"
        ]
      },
      {
        title: "6. お問い合わせ",
        content: [
          "本プライバシーポリシーに関するご質問や懸念がある場合は、サイト内のFeedbackフォーム、またはGitHubリポジトリを通じてお問い合わせください。"
        ]
      }
    ]
  }
};

import { CommandCenter } from "@/components/hybrid/command-center";
import { BentoGrid } from "@/components/hybrid/bento-grid";
import { Header } from "@/components/hybrid/header"; // 👈 追加

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-[#050505] text-white overflow-x-hidden selection:bg-blue-500/30">
      
      {/* 1. 固定ヘッダー (言語切り替えなど) */}
      <Header />

      {/* 2. 背景装飾 (Blur) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* スマホ用: シンプルなグラデーション */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-transparent to-purple-900/10 sm:hidden" />
        
        {/* PC用: リッチなBlur */}
        <div className="hidden sm:block absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[120px]" />
        <div className="hidden sm:block absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/10 blur-[120px]" />
      </div>

      {/* 3. メインコンテンツ */}
      <div className="relative z-10 flex flex-col items-center min-h-screen p-4 sm:p-8 gap-8 sm:gap-16 pt-24 sm:pt-32">
        <div className="w-full">
          <CommandCenter />
        </div>
        
        <BentoGrid />
      </div>
    </main>
  );
}
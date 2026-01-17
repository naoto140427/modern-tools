import { CommandCenter } from "@/components/hybrid/command-center";
import { BentoGrid } from "@/components/hybrid/bento-grid";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-[#050505] text-white overflow-x-hidden selection:bg-white/20">
      
      {/* 修正ポイント：重すぎるBlur装飾を最適化 */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* スマホ用: シンプルなグラデーション (軽い) */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-transparent to-purple-900/10 sm:hidden" />
        
        {/* PC用: リッチなBlur (重いけど綺麗) - hidden sm:block でPCのみ表示 */}
        <div className="hidden sm:block absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[120px]" />
        <div className="hidden sm:block absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/10 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center min-h-screen p-4 sm:p-8 gap-8 sm:gap-12">
        <div className="mt-20 sm:mt-10 w-full"> {/* スマホはヘッダーとかぶりやすいのでマージン増 */}
          <CommandCenter />
        </div>
        
        <BentoGrid />
      </div>
    </main>
  );
}
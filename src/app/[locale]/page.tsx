import { CommandCenter } from "@/components/hybrid/command-center";
import { BentoGrid } from "@/components/hybrid/bento-grid"; // 👈 追加

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-[#050505] text-white overflow-x-hidden selection:bg-white/20">
      {/* 背景の装飾 */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/10 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center min-h-screen p-4 sm:p-8 gap-12">
        {/* メインツール (少し上に余白を持たせる) */}
        <div className="mt-10 w-full">
          <CommandCenter />
        </div>
        
        {/* Bento Grid (ここが新しくなりました！) */}
        <BentoGrid />
      </div>
    </main>
  );
}
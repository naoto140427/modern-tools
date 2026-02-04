import { Github, Heart } from "lucide-react";
import { Link } from "@/i18n/routing";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-black/20 backdrop-blur-md py-12 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <p className="text-sm text-neutral-500">
            &copy; {new Date().getFullYear()} Lumina Studio. All rights reserved.
          </p>
          <p className="text-xs text-neutral-600 mt-1">
            Privacy-first, serverless tools for everyone.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6">
          <Link
            href="/feedback"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs text-neutral-400 hover:text-pink-400 hover:bg-pink-500/10 hover:border-pink-500/20 transition-all duration-300 group"
          >
            <Heart className="w-3.5 h-3.5 group-hover:fill-current" />
            Feedback
          </Link>

          <div className="h-4 w-px bg-white/10 hidden md:block" />

          <Link href="/about" className="text-sm text-neutral-500 hover:text-white transition-colors">
            Privacy & About
          </Link>
          <Link href="/blog" className="text-sm text-neutral-500 hover:text-white transition-colors">
            Blog
          </Link>
          <Link href="/settings" className="text-sm text-neutral-500 hover:text-white transition-colors">
            Settings
          </Link>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-white transition-colors">
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}

import { Github } from "lucide-react";

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

        <div className="flex items-center gap-6">
          <a href="#" className="text-sm text-neutral-500 hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="text-sm text-neutral-500 hover:text-white transition-colors">
            Terms of Service
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-white transition-colors">
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}

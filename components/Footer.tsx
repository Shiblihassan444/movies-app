import { Twitter, Instagram, Mail, Send } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full text-gray-400 mt-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8 py-8">
        {/* Navigation */}
        <nav className="flex flex-col md:flex-row items-center gap-4">
          <a href="/" className="hover:text-white transition-colors text-sm">
            Home
          </a>

          <a
            href="/#latest"
            className="hover:text-white transition-colors text-sm"
          >
            Latest
          </a>
          <a
            href="/#featured"
            className="hover:text-white transition-colors text-sm"
          >
            Featured
          </a>
        </nav>
        {/* Social Media */}
        <div className="flex items-center gap-6">
          <a
            href="https://twitter.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="hover:text-white"
          >
            <Send size={22} />
          </a>
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-white"
          >
            <Instagram size={22} />
          </a>
          <a
            href="mailto:contact@moviewatch.com"
            aria-label="Email"
            className="hover:text-white"
          >
            <Mail size={22} />
          </a>
        </div>
      </div>
      <div className="w-full text-center text-sm text-gray-500 pb-4">
        &copy; {new Date().getFullYear()} Moviewatch.{" "}
        <a
          href="https://github.com/alonearif25"
          className="hover:text-white transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          Developed by alonearif inc.
        </a>
      </div>
    </footer>
  );
}

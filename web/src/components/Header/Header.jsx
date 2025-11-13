import { Menu } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A] border-b border-gray-800 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="text-xl sm:text-2xl font-bold text-white font-jetbrains-mono">
          <a href="/">Lunos AI</a>
        </div>

        {/* Navigation menu - hidden on mobile, shown on larger screens */}
        <div className="hidden sm:flex space-x-4 lg:space-x-8">
          <a
            href="#features"
            className="text-gray-300 hover:text-[#F59E0B] transition-colors font-jetbrains-mono"
          >
            Features
          </a>
          <a
            href="#about"
            className="text-gray-300 hover:text-[#F59E0B] transition-colors font-jetbrains-mono"
          >
            About
          </a>
        </div>

        {/* Get Started Button */}
        <div className="hidden sm:block">
          <a
            href="/account/signup"
            className="bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black px-6 py-2 rounded-lg font-medium hover:scale-105 transition-all duration-300 font-jetbrains-mono"
          >
            Get Started
          </a>
        </div>

        {/* Mobile menu button */}
        <button className="sm:hidden p-1 text-gray-300 hover:text-[#F59E0B] transition-colors">
          <Menu size={20} />
        </button>
      </div>
    </header>
  );
}

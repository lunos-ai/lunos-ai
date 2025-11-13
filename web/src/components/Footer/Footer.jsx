export function Footer() {
  return (
    <footer className="py-8 sm:py-12 bg-[#0A0A0A] border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          {/* Logo and Copyright */}
          <div className="text-center sm:text-left">
            <div className="text-lg font-bold text-white mb-2 font-jetbrains-mono">
              Lunos AI
            </div>
            <p className="text-sm text-gray-400 font-jetbrains-mono">
              © Lunos AI 2025. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex space-x-6">
            <a
              href="#features"
              className="text-sm text-gray-400 hover:text-[#F59E0B] transition-colors font-jetbrains-mono"
            >
              Features
            </a>
            <a
              href="#about"
              className="text-sm text-gray-400 hover:text-[#F59E0B] transition-colors font-jetbrains-mono"
            >
              About
            </a>
            <a
              href="/account/signin"
              className="text-sm text-gray-400 hover:text-[#F59E0B] transition-colors font-jetbrains-mono"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

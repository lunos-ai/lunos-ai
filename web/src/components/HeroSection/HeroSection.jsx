import { StudyMockup } from "./StudyMockup";

export function HeroSection() {
  return (
    <section className="pt-16 pb-12 sm:pb-20 bg-[#0A0A0A] overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#F59E0B] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-60 right-1/4 w-80 h-80 bg-[#C0C0C0] rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse delay-700"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-[#F59E0B] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[85vh]">
          {/* Left column: Hero text and CTA */}
          <div className="space-y-6 sm:space-y-8 pt-4 sm:pt-8 text-center lg:text-left">
            {/* Main headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight font-jetbrains-mono">
              Your Personal AI Study Companion
            </h1>

            {/* Subtext paragraph */}
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-2xl font-jetbrains-mono">
              Ask, learn, and grow with confidence. Get instant answers to your
              IGCSE questions powered by advanced AI.
            </p>

            {/* CTA button */}
            <div className="pt-4 sm:pt-6">
              <a
                href="/account/signup"
                className="inline-block px-8 py-4 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black rounded-xl font-bold hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:ring-offset-2 focus:ring-offset-[#0A0A0A] transition-all duration-300 shadow-lg shadow-[#F59E0B]/25 font-jetbrains-mono"
              >
                Get Started
              </a>
            </div>
          </div>

          {/* Right column: Study interface mockup */}
          <StudyMockup />
        </div>
      </div>
    </section>
  );
}

import { Zap, TrendingUp, Gift } from "lucide-react";

const features = [
  {
    title: "Instant Answers",
    description:
      "Get immediate responses to your IGCSE questions powered by advanced AI technology.",
    icon: Zap,
  },
  {
    title: "Constantly Evolving",
    description:
      "More features keep coming to enhance your learning experience and study efficiency.",
    icon: TrendingUp,
  },
  {
    title: "Free to Start",
    description:
      "Begin your AI-powered learning journey at no cost with our generous free tier.",
    icon: Gift,
  },
];

export function FeatureSection() {
  return (
    <section
      id="features"
      className="py-16 lg:py-24 bg-[#0A0A0A] relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#F59E0B] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-[#C0C0C0] rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse delay-700"></div>
        <div className="absolute bottom-10 left-1/3 w-64 h-64 bg-[#F59E0B] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16 sm:mb-20">
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black text-sm font-medium rounded-full mb-6 sm:mb-8 font-jetbrains-mono">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 font-jetbrains-mono">
            Why Choose Lunos AI?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-jetbrains-mono">
            Built specifically for IGCSE students to accelerate your learning
            journey
          </p>
        </div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-8 hover:border-[#F59E0B] transition-all duration-300 group hover:shadow-2xl hover:shadow-[#F59E0B]/10"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon size={32} className="text-black" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-4 font-jetbrains-mono">
                {feature.title}
              </h3>

              <p className="text-gray-300 leading-relaxed font-jetbrains-mono">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 sm:mt-20">
          <a
            href="/account/signup"
            className="inline-block px-8 py-4 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black rounded-xl font-bold hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:ring-offset-2 focus:ring-offset-[#0A0A0A] transition-all duration-300 shadow-lg shadow-[#F59E0B]/25 font-jetbrains-mono"
          >
            Get Started Today
          </a>
        </div>
      </div>
    </section>
  );
}

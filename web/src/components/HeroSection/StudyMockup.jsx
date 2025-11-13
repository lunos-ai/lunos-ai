export function StudyMockup() {
  return (
    <div className="relative lg:pl-8 flex justify-center lg:justify-end">
      <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-sm">
        {/* Study interface header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h3 className="text-lg font-semibold text-white font-jetbrains-mono">
            Lunos AI
          </h3>
          <div className="w-3 h-3 bg-[#F59E0B] rounded-full animate-pulse"></div>
        </div>

        {/* Study conversation */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex">
            <div className="bg-[#2A2A2A] border border-gray-700 rounded-2xl p-3 max-w-[280px]">
              <p className="text-sm text-gray-100 font-jetbrains-mono">
                Hi! I'm your IGCSE study companion. What physics concept would
                you like to explore today?
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-gradient-to-r from-[#F59E0B] to-[#D97706] rounded-2xl p-3 max-w-[200px]">
              <p className="text-sm text-black font-jetbrains-mono">
                Explain momentum
              </p>
            </div>
          </div>
          <div className="flex">
            <div className="bg-[#2A2A2A] border border-gray-700 rounded-2xl p-3 max-w-[260px]">
              <p className="text-sm text-gray-100 font-jetbrains-mono">
                Momentum is mass × velocity. It's how much motion an object has.
                The more massive and faster something is, the more momentum it
                has!
              </p>
            </div>
          </div>
        </div>

        {/* Study input */}
        <div className="mt-6 sm:mt-8">
          <input
            type="text"
            placeholder="Ask about any IGCSE topic..."
            className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] font-jetbrains-mono"
          />
        </div>
      </div>
    </div>
  );
}

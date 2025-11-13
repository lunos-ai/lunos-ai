import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import { ChevronLeft, ChevronRight } from "lucide-react";

const EXAM_BOARDS = [
  "Cambridge Assessment International Education",
  "Oxford AQA International Qualifications",
  "Pearson Edexcel International Examinations",
];

const SUBJECTS = [
  { id: "physics", name: "Physics", available: true },
  { id: "math", name: "Mathematics", available: true },
  { id: "chemistry", name: "Chemistry", available: false },
  { id: "biology", name: "Biology", available: false },
  { id: "others", name: "Others", available: false },
];

export default function OnboardingPage() {
  const { data: user, loading: userLoading } = useUser();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [examBoards, setExamBoards] = useState({});
  const [selectedPlan, setSelectedPlan] = useState("orbit");

  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = "/account/signin";
      return;
    }

    if (user?.name) {
      setName(user.name);
    }
  }, [user, userLoading]);

  const handleSubjectToggle = (subjectId) => {
    if (!SUBJECTS.find((s) => s.id === subjectId)?.available) return;

    if (selectedSubjects.includes(subjectId)) {
      setSelectedSubjects(selectedSubjects.filter((id) => id !== subjectId));
      const newExamBoards = { ...examBoards };
      delete newExamBoards[subjectId];
      setExamBoards(newExamBoards);
    } else {
      setSelectedSubjects([...selectedSubjects, subjectId]);
    }
  };

  const handleExamBoardChange = (subjectId, examBoard) => {
    setExamBoards({ ...examBoards, [subjectId]: examBoard });
  };

  const handleNext = async () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      setLoading(true);
      try {
        const subjects = selectedSubjects.map((subjectId) => ({
          subject: subjectId,
          examBoard: examBoards[subjectId] || EXAM_BOARDS[0],
        }));

        const response = await fetch("/api/onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            subjects,
            planType: selectedPlan,
          }),
        });

        if (response.ok) {
          window.location.href = "/dashboard";
        } else {
          throw new Error("Failed to complete onboarding");
        }
      } catch (error) {
        console.error("Onboarding error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return name.trim().length > 0;
      case 2:
        return selectedSubjects.length > 0;
      case 3:
        return selectedSubjects.every((subjectId) => examBoards[subjectId]);
      case 4:
        return selectedPlan !== "";
      default:
        return false;
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#121212] flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400 font-jetbrains-mono">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#F59E0B] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-[#C0C0C0] rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse delay-700"></div>
        <div className="absolute bottom-10 left-1/3 w-64 h-64 bg-[#F59E0B] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white font-jetbrains-mono">
            Lunos AI
          </h1>
          <p className="text-gray-400 mt-2 font-jetbrains-mono">
            Let's set up your learning experience
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full ${
                  step === currentStep
                    ? "bg-[#F59E0B]"
                    : step < currentStep
                      ? "bg-gray-400"
                      : "bg-gray-600"
                }`}
              />
            ))}
          </div>
          <span className="ml-4 text-sm text-gray-400 font-jetbrains-mono">
            {currentStep}/4
          </span>
        </div>

        {/* Onboarding Content */}
        <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl shadow-2xl p-8">
          {/* Step 1: Name */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 font-jetbrains-mono">
                  Welcome to Lunos! What's your name?
                </h2>
              </div>

              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] font-jetbrains-mono"
                />
              </div>
            </div>
          )}

          {/* Step 2: Subjects */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 font-jetbrains-mono">
                  Which subjects are you taking?
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                  You can change these later in your settings
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {SUBJECTS.map((subject) => (
                  <button
                    key={subject.id}
                    onClick={() => handleSubjectToggle(subject.id)}
                    disabled={!subject.available}
                    className={`p-4 rounded-lg border-2 transition-colors font-jetbrains-mono ${
                      selectedSubjects.includes(subject.id)
                        ? "border-[#F59E0B] bg-[#FEF3C7] dark:bg-[#92400E] text-[#92400E] dark:text-[#FEF3C7]"
                        : subject.available
                          ? "border-gray-200 dark:border-gray-600 hover:border-[#F59E0B] text-gray-700 dark:text-gray-300"
                          : "border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50"
                    }`}
                  >
                    {subject.name}
                    {!subject.available && (
                      <div className="text-xs mt-1">Coming Soon</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Exam Boards */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 font-jetbrains-mono">
                  Which exam board are you taking these with?
                </h2>
              </div>

              <div className="space-y-4">
                {selectedSubjects.map((subjectId) => {
                  const subject = SUBJECTS.find((s) => s.id === subjectId);
                  return (
                    <div key={subjectId} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {subject?.name}
                      </label>
                      <select
                        value={examBoards[subjectId] || ""}
                        onChange={(e) =>
                          handleExamBoardChange(subjectId, e.target.value)
                        }
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] font-jetbrains-mono"
                      >
                        <option value="">Select exam board...</option>
                        {EXAM_BOARDS.map((board) => (
                          <option key={board} value={board}>
                            {board}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Plan Selection */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 font-jetbrains-mono">
                  Which plan would you like to go with?
                </h2>
              </div>

              <div className="space-y-4">
                {/* Orbit Plan */}
                <button
                  onClick={() => setSelectedPlan("orbit")}
                  className={`w-full p-6 rounded-lg border-2 transition-colors text-left ${
                    selectedPlan === "orbit"
                      ? "border-[#F59E0B] bg-[#FEF3C7] dark:bg-[#92400E]"
                      : "border-gray-200 dark:border-gray-600 hover:border-[#F59E0B]"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
                        Orbit (Free)
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                        3 messages per day
                      </p>
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
                      $0
                    </div>
                  </div>
                </button>

                {/* Nova Monthly Plan */}
                <button
                  disabled
                  className="w-full p-6 rounded-lg border-2 transition-colors text-left border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 opacity-50 cursor-not-allowed"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400 font-jetbrains-mono">
                        Nova (Monthly)
                      </h3>
                      <p className="text-sm text-gray-400 dark:text-gray-500 font-jetbrains-mono">
                        Coming Soon
                      </p>
                    </div>
                    <div className="text-xl font-bold text-gray-500 dark:text-gray-400 font-jetbrains-mono">
                      $5/month
                    </div>
                  </div>
                </button>

                {/* Nova Yearly Plan */}
                <button
                  disabled
                  className="w-full p-6 rounded-lg border-2 transition-colors text-left border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 opacity-50 cursor-not-allowed"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400 font-jetbrains-mono">
                        Nova (Yearly)
                      </h3>
                      <p className="text-sm text-gray-400 dark:text-gray-500 font-jetbrains-mono">
                        Coming Soon • 20% off
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 font-jetbrains-mono">
                        Was $60/year
                      </p>
                    </div>
                    <div className="text-xl font-bold text-gray-500 dark:text-gray-400 font-jetbrains-mono">
                      $48/year
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-jetbrains-mono"
            >
              <ChevronLeft size={20} className="mr-1" />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed() || loading}
              className="flex items-center px-6 py-2 bg-[#F59E0B] text-white rounded-lg hover:bg-[#D97706] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-jetbrains-mono"
            >
              {loading
                ? "Completing..."
                : currentStep === 4
                  ? "Complete Setup"
                  : "Next"}
              {!loading && currentStep < 4 && (
                <ChevronRight size={20} className="ml-1" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

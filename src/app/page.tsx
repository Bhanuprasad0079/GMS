import React from "react";
import Link from "next/link"; // Assuming you use Next.js Link for routing

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <header className="bg-gradient-to-b from-indigo-50 via-sky-50 to-slate-50 py-16 sm:py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 mb-4 leading-tight">
            Resolve Issues.{" "}
            <span className="block text-indigo-600">Foster Trust.</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            The simplest and most transparent way to report and track your
            concerns with guaranteed confidentiality and timely action.
          </p>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/dashboard">
              <button className="w-full sm:w-auto px-8 py-3 text-base sm:text-lg font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition duration-200 shadow-md hover:shadow-lg">
                🚨 Submit a Grievance Now
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="w-full sm:w-auto px-8 py-3 text-base sm:text-lg font-semibold rounded-lg text-indigo-700 bg-white border border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 transition duration-200">
                Check My Status
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Feature/Value Proposition Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">
            Why Choose Our System?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-50 p-6 rounded-xl shadow-sm text-center border border-slate-200">
              <span className="text-4xl text-indigo-500 mb-3 block">🔒</span>
              <h3 className="text-lg font-semibold mb-2 text-slate-900">
                Confidentiality
              </h3>
              <p className="text-slate-600 text-sm sm:text-base">
                Your identity and details are protected. Report issues without
                fear of reprisal.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 p-6 rounded-xl shadow-sm text-center border border-slate-200">
              <span className="text-4xl text-indigo-500 mb-3 block">⏱️</span>
              <h3 className="text-lg font-semibold mb-2 text-slate-900">
                Timely Resolution
              </h3>
              <p className="text-slate-600 text-sm sm:text-base">
                Our internal SLAs ensure that all complaints are assigned and
                addressed within set deadlines.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 p-6 rounded-xl shadow-sm text-center border border-slate-200">
              <span className="text-4xl text-indigo-500 mb-3 block">🔗</span>
              <h3 className="text-lg font-semibold mb-2 text-slate-900">
                Full Transparency
              </h3>
              <p className="text-slate-600 text-sm sm:text-base">
                Track your complaint in real-time from submission to final
                closure with your unique ID.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (Simplified Flow) */}
      <section className="py-16 bg-sky-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">
            How Simple It Is
          </h2>
          <div className="relative flex justify-center">
            {/* Horizontal Line for Flow */}
            <div className="absolute hidden sm:block w-3/4 h-[2px] bg-indigo-100 top-1/2 transform -translate-y-1/2"></div>

            {/* Flow Steps */}
            <div className="grid sm:grid-cols-3 gap-10 sm:gap-6 relative z-10">
              <div className="relative p-4">
                <div className="w-12 h-12 flex items-center justify-center bg-indigo-600 text-white rounded-full text-lg font-bold mx-auto mb-3 shadow-sm">
                  1
                </div>
                <p className="font-semibold text-slate-800">Report</p>
                <p className="mt-2 text-sm text-slate-600 max-w-xs mx-auto">
                  Submit your grievance with clear details and supporting
                  information.
                </p>
              </div>
              <div className="relative p-4">
                <div className="w-12 h-12 flex items-center justify-center bg-indigo-600 text-white rounded-full text-lg font-bold mx-auto mb-3 shadow-sm">
                  2
                </div>
                <p className="font-semibold text-slate-800">Investigate</p>
                <p className="mt-2 text-sm text-slate-600 max-w-xs mx-auto">
                  The concerned department reviews, assigns, and investigates
                  your case.
                </p>
              </div>
              <div className="relative p-4">
                <div className="w-12 h-12 flex items-center justify-center bg-indigo-600 text-white rounded-full text-lg font-bold mx-auto mb-3 shadow-sm">
                  3
                </div>
                <p className="font-semibold text-slate-800">Resolve</p>
                <p className="mt-2 text-sm text-slate-600 max-w-xs mx-auto">
                  You receive a clear, documented resolution with closure
                  confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-200 py-6 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>
            &copy; 2025{" "}
            <span className="font-semibold text-indigo-300">
              GrievanceResolve
            </span>
            . Built for fairness and efficiency.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

import React from 'react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header/Hero Section */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Grievance Management Service
          </h1>
          <p className="mt-1 text-lg text-gray-600">
            Your voice matters. Report, track, and resolve issues efficiently.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
        {/* Core Needs Section */}
        <section className="bg-white p-8 rounded-lg shadow-lg mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-2">
            🔑 Basic Needs of Our Service
          </h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="flex-shrink-0 text-indigo-600 font-bold mr-3">1.</span>
              <p className="text-gray-700">
                <strong>Easy Submission:</strong> Provide a simple, intuitive form for users to log a grievance quickly, including options for attachments.
              </p>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 text-indigo-600 font-bold mr-3">2.</span>
              <p className="text-gray-700">
                <strong>Secure & Private:</strong> Ensure all submissions are handled with confidentiality and stored securely.
              </p>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 text-indigo-600 font-bold mr-3">3.</span>
              <p className="text-gray-700">
                <strong>Transparent Tracking:</strong> Give users a unique tracking ID and real-time progress updates.
              </p>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 text-indigo-600 font-bold mr-3">4.</span>
              <p className="text-gray-700">
                <strong>Efficient Resolution:</strong> Enable administrators to act, escalate, and resolve issues quickly.
              </p>
            </li>
          </ul>
        </section>

        <hr className="my-12" />

        {/* Workflow Section */}
        <section className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-2">
            🚀 Our Grievance Management Workflow
          </h2>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            {/* Step 1 */}
            <div className="p-4 border border-indigo-200 rounded-lg bg-indigo-50">
              <div className="text-3xl font-bold text-indigo-600 mb-2">1</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Submit</h3>
              <p className="text-sm text-gray-700">
                The user logs a complaint and receives a unique Tracking ID.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 border border-green-200 rounded-lg bg-green-50">
              <div className="text-3xl font-bold text-green-600 mb-2">2</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Review & Assign</h3>
              <p className="text-sm text-gray-700">
                Admin reviews the complaint and assigns it to the appropriate department.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
              <div className="text-3xl font-bold text-yellow-600 mb-2">3</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Investigate & Act</h3>
              <p className="text-sm text-gray-700">
                The assigned officer investigates and takes action.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              <div className="text-3xl font-bold text-red-600 mb-2">4</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Resolve & Close</h3>
              <p className="text-sm text-gray-700">
                The grievance is resolved, closed, and feedback is collected.
              </p>
            </div>
          </div>
        </section>

        {/* Button */}
        <div className="mt-10 text-center">
          <button className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition">
            Submit a New Grievance
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-4 text-center text-sm text-gray-600 border-t">
        © 2025 Grievance Management Service. All Rights Reserved.
      </footer>
    </div>
  );
};

export default HomePage;

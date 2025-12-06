// pages/about.js or app/about/page.js

import Head from 'next/head';

const AboutPage = () => {
  return (
    <>
      <Head>
        <title>About Us - Grievance Management System</title>
        <meta
          name="description"
          content="Learn about the purpose and function of our Grievance Management System."
        />
      </Head>

      {/* Full Page Background (Same as HomePage) */}
      <div className="min-h-screen bg-gray-100">
        
        <div className="max-w-7xl mx-auto p-6 md:p-12">

          {/* Main Heading */}
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b-4 border-indigo-600 pb-2">
            About Our Grievance Management System (GMS)
          </h1>

          {/* Intro Section */}
          <section className="bg-white p-8 rounded-lg shadow-lg mb-10">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
              Our Purpose
            </h2>
            <p className="text-gray-700 leading-relaxed">
              This platform provides a fair, efficient, and transparent grievance-handling
              system. Our aim is to maintain a positive environment by offering a responsive
              and reliable mechanism to resolve issues raised by users.
            </p>
          </section>

          {/* Key Features */}
          <section className="bg-white p-8 rounded-lg shadow-lg mb-10">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
              Key Features & Commitments
            </h2>
            <ul className="list-disc list-inside space-y-4 text-gray-700">
              <li>
                <span className="font-semibold">Ease of Submission:</span>  
                Users can submit grievances quickly with a simple interface.
              </li>
              <li>
                <span className="font-semibold">Tracking & Transparency:</span>  
                Every grievance gets a unique Tracking ID for live updates.
              </li>
              <li>
                <span className="font-semibold">Confidentiality:</span>  
                All grievances are handled securely with privacy protection.
              </li>
              <li>
                <span className="font-semibold">Timely Resolution:</span>  
                We follow defined timelines to process and resolve complaints.
              </li>
            </ul>
          </section>

          {/* How It Works */}
          <section className="bg-white p-8 rounded-lg shadow-lg mb-10">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
              How the System Works
            </h2>
            <ol className="list-decimal list-inside space-y-4 text-gray-700">
              <li>
                <span className="font-semibold">Submission:</span>  
                User submits a grievance and receives a Tracking ID.
              </li>
              <li>
                <span className="font-semibold">Assignment:</span>  
                The system assigns it to the relevant authority.
              </li>
              <li>
                <span className="font-semibold">Investigation:</span>  
                The authority investigates and updates the progress.
              </li>
              <li>
                <span className="font-semibold">Resolution:</span>  
                The grievance is marked resolved and the user is notified.
              </li>
            </ol>
          </section>

          {/* CTA Box */}
          <section className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold text-indigo-800 mb-2">
              Have a Grievance?
            </h3>
            <p className="text-indigo-700">
              Visit the{" "}
              <a
                href="/dashboard"
                className="text-indigo-600 hover:text-indigo-800 font-semibold underline"
              >
                grievance submission demo
              </a>{" "}
              to file a complaint.  
              For technical support, contact  
              <span className="font-semibold"> support@yourcompany.com</span>.
            </p>
          </section>

        </div>
      </div>
    </>
  );
};

export default AboutPage;

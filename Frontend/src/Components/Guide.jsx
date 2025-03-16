import React from "react";

// Guidance component - this is the 3rd component you requested
const Guidance = () => {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">About Swasthya Sanjivani</h2>
        
        {/* Main heading */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4" style={{ color: '#0e606e' }}>Revolutionizing Healthcare, One Digital Record at a Time</h3>
          <p className="text-gray-700 mb-4">
            At <span className="font-semibold" style={{ color: '#0e606e' }}>Swasthya Sanjivani</span>, we are on a mission to transform India's healthcare system by replacing outdated paper-based records with a secure, unified, and patient-centric digital platform. Inspired by the legendary "Sanjivani" herb that symbolizes healing and vitality, our platform empowers doctors, patients, and medical professionals to collaborate seamlessly while safeguarding health data for millions of families.
          </p>
        </div>
        
        {/* Our Vision */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4" style={{ color: '#0e606e' }}>Our Vision</h3>
          <p className="text-gray-700 mb-4">
            To create a future where <span className="font-semibold">no Indian struggles with lost prescriptions, incomplete medical histories, or fragmented healthcare</span>. We envision a digitally connected ecosystem where every citizen's health records are accessible, accurate, and secure – anytime, anywhere.
          </p>
        </div>
        
        {/* How We Work */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4" style={{ color: '#0e606e' }}>How We Work</h3>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold" style={{ color: '#0e606e' }}>Swasthya Sanjivani</span> simplifies healthcare management through innovation:
          </p>
          
          {/* Feature 1 */}
          <div className="ml-4 mb-4">
            <h4 className="font-semibold mb-2" style={{ color: '#0e606e' }}>1. Mobile-First Health Identity</h4>
            <ul className="list-disc pl-8 text-gray-700 space-y-2">
              <li>Every patient is uniquely identified by their <span className="font-semibold">mobile number</span>, eliminating the hassle of physical documents.</li>
              <li>Manage <span className="font-semibold">entire families</span> under one mobile number, with individual IDs for each member.</li>
            </ul>
          </div>
          
          {/* Feature 2 */}
          <div className="ml-4 mb-4">
            <h4 className="font-semibold mb-2" style={{ color: '#0e606e' }}>2. Secure OTP Authentication</h4>
            <ul className="list-disc pl-8 text-gray-700 space-y-2">
              <li>Doctors and assistants access patient records only after <span className="font-semibold">OTP verification</span>, ensuring privacy and preventing unauthorized access.</li>
            </ul>
          </div>
          
          {/* Feature 3 */}
          <div className="ml-4 mb-4">
            <h4 className="font-semibold mb-2" style={{ color: '#0e606e' }}>3. Smart Dashboards for Everyone</h4>
            <ul className="list-disc pl-8 text-gray-700 space-y-2">
              <li><span className="font-semibold">Patients:</span> View prescriptions, lab reports, and treatment history. Track your family's health in one place.</li>
              <li><span className="font-semibold">Doctors:</span> Access comprehensive medical histories, diagnose confidently, and prescribe treatments digitally.</li>
              <li><span className="font-semibold">Assistants:</span> Upload new reports or print records without editing privileges, ensuring data integrity.</li>
            </ul>
          </div>
          
          {/* Feature 4 */}
          <div className="ml-4 mb-4">
            <h4 className="font-semibold mb-2" style={{ color: '#0e606e' }}>4. Family-Centric Care</h4>
            <ul className="list-disc pl-8 text-gray-700 space-y-2">
              <li>Link parents, children, and dependents to a single mobile number. Switch between profiles effortlessly during hospital visits.</li>
            </ul>
          </div>
          
          {/* Feature 5 */}
          <div className="ml-4 mb-4">
            <h4 className="font-semibold mb-2" style={{ color: '#0e606e' }}>5. Zero Assistant Data Overhead</h4>
            <ul className="list-disc pl-8 text-gray-700 space-y-2">
              <li>Assistants work under their supervising doctor's ID, requiring no separate storage of their personal data.</li>
            </ul>
          </div>
        </div>
        <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4" style={{ color: '#0e606e' }}>Why Choose Swasthya Sanjivani?</h3>
        
        {/* For Patients */}
        <div className="ml-4 mb-4">
          <div className="flex items-start mb-2">
            <div className="mt-1 mr-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#0e606e' }}></div>
            </div>
            <p className="font-semibold">For Patients:</p>
          </div>
          <ul className="ml-6 space-y-2">
            <li className="flex items-start">
              <div className="mt-1 mr-2">
                <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: '#0e606e' }}></div>
              </div>
              <p>Never lose a prescription or report again.</p>
            </li>
            <li className="flex items-start">
              <div className="mt-1 mr-2">
                <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: '#0e606e' }}></div>
              </div>
              <p>Share health records instantly with any doctor, anywhere in India.</p>
            </li>
          </ul>
        </div>
        
        {/* For Doctors */}
        <div className="ml-4 mb-4">
          <div className="flex items-start mb-2">
            <div className="mt-1 mr-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#0e606e' }}></div>
            </div>
            <p className="font-semibold">For Doctors:</p>
          </div>
          <ul className="ml-6 space-y-2">
            <li className="flex items-start">
              <div className="mt-1 mr-2">
                <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: '#0e606e' }}></div>
              </div>
              <p>Make informed decisions with 24/7 access to patient histories.</p>
            </li>
            <li className="flex items-start">
              <div className="mt-1 mr-2">
                <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: '#0e606e' }}></div>
              </div>
              <p>Reduce administrative burdens and focus on saving lives.</p>
            </li>
          </ul>
        </div>
        
        {/* For Patients (2nd entry) */}
        <div className="ml-4 mb-4">
          <div className="flex items-start mb-2">
            <div className="mt-1 mr-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#0e606e' }}></div>
            </div>
            <p className="font-semibold">For Patients:</p>
          </div>
          <ul className="ml-6 space-y-2">
            <li className="flex items-start">
              <div className="mt-1 mr-2">
                <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: '#0e606e' }}></div>
              </div>
              <p>Cut paperwork, reduce errors, and accelerate India's journey toward.</p>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Added section: Our Commitment to Security */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4" style={{ color: '#0e606e' }}>Our Commitment to Security</h3>
        <p className="mb-4">Your trust is our priority. We use:</p>
        
        <ul className="space-y-3">
          <li className="flex items-center">
            <i className="ri-lock-line text-xl mr-3" style={{ color: '#0e606e' }}></i>
            <div>
              <span className="font-semibold">End-to-end encryption</span> for all health data.
            </div>
          </li>
          <li className="flex items-center">
            <i className="ri-shield-user-line text-xl mr-3" style={{ color: '#0e606e' }}></i>
            <div>
              <span className="font-semibold">Role-based access</span> control to restrict editing privileges.
            </div>
          </li>
          <li className="flex items-center">
            <i className="ri-shield-check-line text-xl mr-3" style={{ color: '#0e606e' }}></i>
            <div>
              <span className="font-semibold">Regular audits</span> to comply with India's data protection standards.
            </div>
          </li>
        </ul>
      </div>
      
      {/* Added section: Join the Sanjivani Movement */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-4" style={{ color: '#0e606e' }}>Join the Sanjivani Movement</h3>
        
        <p className="mb-4">
          We're not just building a platform – we're nurturing a healthier India. Whether you're a patient, doctor, or healthcare provider, <span className="font-semibold" style={{ color: '#0e606e' }}>Swasthya Sanjivani</span> is here to simplify, secure, and streamline your medical journey.
        </p>
        
        <p className="font-semibold text-lg" style={{ color: '#0e606e' }}>Together, let's heal smarter.</p>
      </div>
      </div>
    );
  };

  export default Guidance;

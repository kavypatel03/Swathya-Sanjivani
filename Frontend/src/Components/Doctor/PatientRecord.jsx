const AccessPatientRecords = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm my-4">
      <h3 className="text-lg font-semibold text-[#0e606e] mb-4">Access Patient Records</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Enter Mobile Number <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="+91-94260-24009"
            className="flex-1 border border-gray-300 rounded p-2"
          />
          <button className="bg-[#0e606e] text-white px-6  rounded whitespace-nowrap w-28">Send OTP</button>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Enter OTP <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter OTP From SMS"
            className="flex-1 border border-gray-300 rounded p-2"
          />
          <button className="bg-[#ff9700] text-white px-6 py-2 rounded whitespace-nowrap w-28">Verify</button>
        </div>
      </div>
    </div>
  );
};

export default AccessPatientRecords;
// File: components/UploadFiles.jsx
import { Upload } from 'react-feather';

function UploadFiles() {
  return (
    <div className="bg-white p-6 rounded-lg shadow mx-1">
      <h2 className="text-lg font-semibold text-[#0e606e] mb-4">Upload New Files</h2>
      <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <Upload size={24} className="text-gray-400" />
          </div>
        </div>
        <p className="text-gray-500 mb-4">Drag and drop files here, or click to select files</p>
        <button className="px-4 py-2 bg-[#0e606e] text-white rounded-md hover:bg-opacity-90">
          Select Files
        </button>
      </div>
    </div>
  );
}

export default UploadFiles;
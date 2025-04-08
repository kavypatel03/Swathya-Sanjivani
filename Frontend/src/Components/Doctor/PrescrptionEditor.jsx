// File: components/PrescriptionEditor.jsx
import { Bold, Italic, List, AlignLeft, Edit, Trash2 } from 'react-feather';
import logo from "../../assets/logo.png";

function PrescriptionEditor() {
  return (
    <div className="bg-white rounded-lg shadow m-1">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-[#0e606e]">Prescription Editor</h2>
            <p className="text-sm text-gray-500">Patient: (Patient Name)</p>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button className="px-4 py-2 bg-[#0e606e] text-white rounded-md hover:bg-opacity-90">
              Save Prescription
            </button>
          </div>
        </div>
        
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <div className="flex items-center p-2 border-b border-gray-300 bg-gray-50">
            <button className="p-2 text-gray-600 hover:bg-gray-200 rounded">
              <Bold size={18} />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-200 rounded">
              <Italic size={18} />
            </button>
            <div className="border-r border-gray-300 h-6 mx-2"></div>
            <button className="p-2 text-gray-600 hover:bg-gray-200 rounded">
              <AlignLeft size={18} />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-200 rounded">
              <List size={18} />
            </button>
            <div className="border-r border-gray-300 h-6 mx-2"></div>
            <button className="p-2 text-gray-600 hover:bg-gray-200 rounded">
              <Edit size={18} />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-200 rounded">
              <Trash2 size={18} />
            </button>
          </div>
          
          <div className="p-6">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h3 className="font-semibold text-lg">Dr. Manoj Shah</h3>
                <p className="text-gray-600">Cardiologist</p>
                <p className="text-gray-600">License No: 12345</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600">Date: March 15, 2024</p>
              </div>
            </div>
            
            <div className="min-h-[300px] text-gray-400">
              Start typing prescription here...
            </div>
            
            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-2">
                  <img src={logo} alt="Logo" className="h-8" />
                </div>
               
              </div>
              <div>
                <div className="border-t border-gray-300 w-48 pt-2 text-center">
                  <p className="text-sm">Doctor's Signature</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrescriptionEditor;

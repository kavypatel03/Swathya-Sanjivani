// PatientModification.jsx
import React from 'react';
import { Link } from 'react-router-dom';
//import { Rieyeline, Ricalendarline } from '@remixicon/react';

const PatientModification = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-[#0e606e] mb-4">Modify Family Member Details</h2>
      
      <form className="space-y-4">
        <div>
          <label className="block mb-2">
            Enter Full Name <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            className="w-full border border-gray-300 rounded p-2"
            placeholder="Enter full name"
            defaultValue="Sanjaybhai Babubhai Gohil"
          />
        </div>
        
        <div>
          <label className="block mb-2">
            Enter Mobile Number <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            className="w-full border border-gray-300 rounded p-2"
            defaultValue="+91-94260-24009"
          />
        </div>
        
        <div>
          <label className="block mb-2">
            Enter E-mail Address <span className="text-red-500">*</span>
          </label>
          <input 
            type="email" 
            className="w-full border border-gray-300 rounded p-2"
            defaultValue="Mahesh123@gmail.com"
          />
        </div>
        
        <div>
          <label className="block mb-2">
            Enter Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input 
              type="password" 
              className="w-full border border-gray-300 rounded p-2"
              defaultValue="••••••••••••"
            />
            <i class="ri-eye-line absolute right-3 top-2 text-gray-500"></i>
            {/*<Rieyeline className="absolute right-3 top-3 text-gray-500" />*/}
          </div>
        </div>
        
        <div>
          <label className="block mb-2">
            Enter Birth Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input 
              type="text" 
              className="w-full border border-gray-300 rounded p-2"
              defaultValue="15 / 01 / 1987"
            />
            <i class="ri-calendar-line absolute right-3 top-2 text-gray-500"></i>
            {/*<Ricalendarline className="absolute right-3 top-3 text-gray-500" />*/}
          </div>
        </div>
        
        <div>
          <label className="block mb-2">
            Enter Age <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            className="w-full border border-gray-300 rounded p-2"
            defaultValue="38"
          />
        </div>
        
        <div>
          <label className="block mb-2">
            Select Relation With Main Person Of Family <span className="text-red-500">*</span>
          </label>
          <select className="w-full border border-gray-300 rounded p-2">
            <option>Self</option>
          </select>
        </div>
        
        <div>
          <label className="block mb-2">
            Select Gender <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input type="radio" name="gender" defaultChecked className="form-radio text-[#0e606e]" />
              <span className="ml-2">Male</span>
            </label>
            <label className="flex items-center">
              <input type="radio" name="gender" className="form-radio text-[#0e606e]" />
              <span className="ml-2">Female</span>
            </label>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 pt-4">
          <button type="button" className="px-6 py-2 border border-gray-300 rounded">Clear</button>
          <button type="button" className="px-6 py-2 border border-gray-300 rounded">Cancel</button>
          <button type="button" className="px-6 py-2 bg-[#0e606e] text-white rounded">Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default PatientModification;
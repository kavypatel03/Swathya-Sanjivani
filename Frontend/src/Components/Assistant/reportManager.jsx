import React from 'react';

const ReportManager = () => {
  const documentCategories = [
    {
      id: 1,
      title: "Prescriptions",
      count: 15,
      icon: "ri-file-list-line",
      color: "bg-blue-100"
    },
    {
      id: 2,
      title: "Lab Reports",
      count: 8,
      icon: "ri-file-chart-line",
      color: "bg-green-100"
    },
    {
      id: 3,
      title: "X-Rays",
      count: 5,
      icon: "ri-image-line",
      color: "bg-purple-100"
    },
    {
      id: 4,
      title: "Others",
      count: 12,
      icon: "ri-file-copy-line",
      color: "bg-yellow-100"
    }
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-[#0e606e] mb-6">Document Manager</h2>
      <div className="space-y-4">
        {documentCategories.map((category) => (
          <div key={category.id} className="border rounded-lg p-4 flex items-center hover:bg-gray-50 cursor-pointer">
            <div className={`${category.color} p-4 rounded-md mr-4`}>
              <i className={`${category.icon} text-2xl`}></i>
            </div>
            <div>
              <h3 className="font-medium text-lg">{category.title}</h3>
              <p className="text-sm text-gray-600">{category.count} Files</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportManager;
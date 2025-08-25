// src/components/EmployeeViewModal.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FiDownload, FiUser } from "react-icons/fi";
import { GetEmployeePhotoUrl } from "../serivices/Employeeservices";
import { GetEmployeeDocumentUrl } from "../serivices/Employeeservices";

const EmployeeViewModal = ({ employee, onClose }) => {
  const navigate = useNavigate();
  
  if (!employee) return null;

  const handleDownload = () => {
    if (employee.document) {
      const downloadUrl = GetEmployeeDocumentUrl(employee.employeeId);
      window.open(downloadUrl, "_blank");
    } else {
      alert("No document available for this employee.");
    }
  };

  const updateEmployee = () => {
    navigate(`/update-employee/${employee.employeeId}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white bg-opacity-10 rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-95 hover:scale-100 border border-white border-opacity-20 glassmorphism-effect">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-white">Employee Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Employee Photo Section */}
            <div className="md:col-span-1 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-white bg-opacity-20 border-2 border-white border-opacity-30 flex items-center justify-center mb-4 overflow-hidden">
                {employee.photo ? (
                  <img
                    src={GetEmployeePhotoUrl(employee.employeeId)}
                    alt={employee.employeeName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser className="text-5xl text-white opacity-70" />
                )}
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-white">{employee.employeeName}</h3>
                <p className="text-blue-200">{employee.department}</p>
                <p className="text-white text-opacity-80 mt-2">{employee.email}</p>
              </div>
            </div>

            {/* Employee Details Section */}
            <div className="md:col-span-2  p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow label="Employee ID" value={employee.employeeId} />
                <InfoRow label="Name" value={employee.employeeName} />
                <InfoRow label="Email" value={employee.email} />
                <InfoRow label="Mobile" value={employee.mobileNumber} />
                <InfoRow label="Department" value={employee.department} />
                <InfoRow label="Date of Birth" value={employee.dateOfBirth} />
                <InfoRow label="Gender" value={employee.gender} />
                <InfoRow label="Salary" value={employee.salary} />
                <InfoRow label="Address" value={employee.address} />
              </div>
            </div>
          </div>

          {/* Document Section */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-3">Document</h3>
            <div className="< p-4">
              {employee.document ? (
                <div className="flex items-center justify-between p-3 bg-white bg-opacity-5 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-white truncate">{employee.document}</p>
                    <p className="text-xs text-white text-opacity-70">Uploaded Document</p>
                  </div>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-blue-500 bg-opacity-70 hover:bg-opacity-100 rounded-lg text-white transition-colors flex items-center"
                    title="Download document"
                  >
                    <FiDownload className="mr-2" />
                    Download
                  </button>
                </div>
              ) : (
                <p className="text-white text-opacity-70">No document uploaded</p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button 
              onClick={updateEmployee} 
              className="px-4 py-2 bg-blue-500 bg-opacity-70 hover:bg-opacity-100 rounded-lg text-white transition-colors"
            >
              Edit
            </button>
            
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for info rows
const InfoRow = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-blue-200 text-sm font-medium">{label}</span>
    <span className="text-white font-medium truncate">{value || "N/A"}</span>
  </div>
);

export default EmployeeViewModal;
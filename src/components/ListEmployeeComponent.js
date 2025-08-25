import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ListEmployees } from "../serivices/Employeeservices";
import { DeleteEmployee } from "../serivices/Employeeservices";
import { GetEmployeePhotoUrl } from "../serivices/Employeeservices";
import { FiPlus, FiEye, FiEdit2, FiTrash2, FiChevronDown, FiDownload, FiSearch, FiX } from "react-icons/fi";
import EmployeeViewModal from "../components/Employee_View_Modal";
import DeleteConfirmationModal from "../components/Delete_Confirmation_Modal";
import { GetEmployeeDocumentUrl } from "../serivices/Employeeservices";
import "jspdf-autotable";
import EmployeePDFDownload from "./EmployeePDFDownload";

const ListEmployeeComponent = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleteEmployeeId, setDeleteEmployeeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Function to get initials from name
  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Function to generate a color based on the name
  const getColorFromName = (name) => {
    if (!name) return "#3B82F6"; // Default blue color
    
    const colors = [
      "#3B82F6", // blue
      "#EF4444", // red
      "#10B981", // green
      "#F59E0B", // yellow
      "#8B5CF6", // purple
      "#EC4899", // pink
      "#06B6D4", // cyan
      "#F97316"  // orange
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  // Fetch employees from API
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await ListEmployees();
      setEmployees(response.data);
      setFilteredEmployees(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to fetch employees. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Filter employees based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(
        (employee) =>
          employee.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.mobileNumber?.includes(searchTerm)
      );
      setFilteredEmployees(filtered);
    }
  }, [searchTerm, employees]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Navigate to update page
  const updateEmployee = (id) => {
    navigate(`/update-employee/${id}`);
    setOpenDropdown(null);
  };

  // Confirm delete
  const confirmDelete = (id, e) => {
    e.stopPropagation();
    setDeleteEmployeeId(id);
    setOpenDropdown(null);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteEmployeeId) return;

    try {
      await DeleteEmployee(deleteEmployeeId);
      await fetchEmployees(); // Refresh the list
      setDeleteEmployeeId(null);
    } catch (error) {
      console.error("Error deleting employee:", error);
      setError("Failed to delete employee. Please try again.");
    }
  };

  // View employee details
  const viewEmployee = (employee, e) => {
    if (e) e.stopPropagation();
    setSelectedEmployee(employee);
    setOpenDropdown(null);
  };

  // Toggle dropdown menu
  const toggleDropdown = (id, e) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === id ? null : id);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Employee Directory</h1>
          <p className="text-gray-600">Manage your organization's employees</p>
        </div>
        <button
          onClick={() => navigate("/add-employee")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          <FiPlus className="text-lg" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name or mobile number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition duration-200"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <FiX className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      {!loading && !error && (
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredEmployees.length} of {employees.length} employees
        </div>
      )}

      {/* Employee Table */}
      <div className=" bg-white shadow-lg rounded-xl border border-gray-100">
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg m-4">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Download</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <tr key={employee.employeeId} className="hover:bg-blue-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.employeeId}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {employee.photo ? (
                          <img 
                            src={GetEmployeePhotoUrl(employee.employeeId)} 
                            alt="Employee" 
                            className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm" 
                          />
                        ) : (
                          <div 
                            className="h-10 w-10 rounded-full flex items-center justify-center text-white font-medium text-sm border-2 border-white shadow-sm"
                            style={{ backgroundColor: getColorFromName(employee.employeeName) }}
                          >
                            {getInitials(employee.employeeName)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{employee.employeeName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{employee.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {employee.department}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{employee.mobileNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          employee.gender === 'Male' 
                            ? 'bg-blue-100 text-blue-800' 
                            : employee.gender === 'Female'
                            ? 'bg-pink-100 text-pink-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {employee.gender}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        ₹{employee.salary}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <EmployeePDFDownload employee={employee} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                        <div className="flex justify-end">
                          <div className="relative inline-block text-left">
                            <button
                              onClick={(e) => toggleDropdown(employee.employeeId, e)}
                              className="inline-flex justify-center items-center w-8 h-8 rounded-full bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            >
                              <FiChevronDown className="transition-transform duration-200" />
                            </button>

                            {openDropdown === employee.employeeId && (
                              <div className="origin-top-right absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 divide-y divide-gray-100">
                                <div className="py-1">
                                  <button
                                    onClick={(e) => viewEmployee(employee, e)}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                                  >
                                    <FiEye className="mr-3 text-green-500" />
                                    View Details
                                  </button>
                                  <button
                                    onClick={() => updateEmployee(employee.employeeId)}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                                  >
                                    <FiEdit2 className="mr-3 text-blue-500" />
                                    Edit
                                  </button>
                                </div>
                                <div className="py-1">
                                  <button
                                    onClick={(e) => confirmDelete(employee.employeeId, e)}
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-150"
                                  >
                                    <FiTrash2 className="mr-3" />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <FiSearch className="text-4xl mb-3 opacity-50" />
                        <p className="text-lg font-medium">No employees found</p>
                        <p className="text-sm mt-1">
                          {searchTerm ? 'Try adjusting your search terms' : 'Add your first employee to get started'}
                        </p>
                        {searchTerm && (
                          <button
                            onClick={clearSearch}
                            className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Clear search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Employee View Modal */}
      <EmployeeViewModal
        employee={selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!deleteEmployeeId}
        onClose={() => setDeleteEmployeeId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ListEmployeeComponent;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AddEmployee, UpdateEmployee, GetEmployeePhotoUrl, GetEmployeeDocumentUrl } from "../serivices/Employeeservices";

const REST_API_BASE_URL = "http://localhost:8080/api/employees";

const AddEmployeeForm = () => {
  const [formData, setFormData] = useState({
    employeeName: "",
    department: "",
    email: "",
    mobileNumber: "",
    gender: "",
    salary: "",
    address: "",
    dateOfBirth: "",
  });
  const [photo, setPhoto] = useState(null);
  const [document, setDocument] = useState(null);
  const [currentPhoto, setCurrentPhoto] = useState("");
  const [currentDocument, setCurrentDocument] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch employee data if editing
  useEffect(() => {
    if (id) {
      setIsEditing(true);
      const fetchEmployee = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(`${REST_API_BASE_URL}/${id}`);
          const emp = response.data;
          
          // Format the date properly for the date input
          let formattedDate = "";
          if (emp.dateOfBirth) {
            const dateObj = new Date(emp.dateOfBirth);
            if (!isNaN(dateObj.getTime())) {
              formattedDate = dateObj.toISOString().split('T')[0];
            }
          }

          setFormData({
            employeeName: emp.employeeName || "",
            department: emp.department || "",
            email: emp.email || "",
            mobileNumber: emp.mobileNumber || "",
            gender: emp.gender || "",
            salary: emp.salary || "",
            address: emp.address || "",
            dateOfBirth: formattedDate,
          });
          
          if (emp.photo) {
            setCurrentPhoto(GetEmployeePhotoUrl(id));
          }
          
          if (emp.document) {
            setCurrentDocument(emp.document);
          }
        } catch (error) {
          console.error("Error fetching employee:", error);
          setMessage("Failed to load employee data. Please check if the employee exists.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchEmployee();
    }
  }, [id]);

  const handleChange = (e) => { 
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    
    // Create a preview URL for the new image
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCurrentPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    setDocument(file);
    
    if (file) {
      setCurrentDocument(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isEditing) {
        await UpdateEmployee(id, {...formData, photo, document});
        setMessage("Employee updated successfully!");
      } else {
        await AddEmployee({...formData, photo, document});
        setMessage("Employee added successfully!");
        setFormData({
          employeeName: "",
          department: "",
          email: "",
          mobileNumber: "",
          gender: "",
          salary: "",
          address: "",
          dateOfBirth: "",
        });
        setPhoto(null);
        setDocument(null);
        setCurrentPhoto("");
        setCurrentDocument("");
      }
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      console.error("Error saving employee:", error);
      setMessage(
        error.response?.data?.message ||
          "Failed to save employee. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setCurrentPhoto("");
  };

  const removeDocument = () => {
    setDocument(null);
    setCurrentDocument("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            {isEditing ? "Edit Employee" : "Add New Employee"}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {isEditing
              ? "Update employee information below"
              : "Fill in the form to add a new team member"}
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          <div className="p-6 sm:p-8">
            {message && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  message.includes("successfully")
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}

            {isLoading && isEditing ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Loading employee data...</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Personal Information */}
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Personal Information</h2>
                    
                    {/* Employee Name */}
                    <div>
                      <label
                        htmlFor="employeeName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="employeeName"
                        name="employeeName"
                        value={formData.employeeName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john.doe@example.com"
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        required
                      />
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label
                        htmlFor="mobileNumber"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Mobile Number
                      </label>
                      <input
                        type="text"
                        id="mobileNumber"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        placeholder="9876543210"
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        required
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label
                        htmlFor="gender"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Gender
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label
                        htmlFor="dateOfBirth"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        required
                      />
                    </div>

                    {/* Address */}
                    <div>
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Address
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="123 Street Name, City, State"
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        required
                        rows="3"
                      />
                    </div>
                  </div>

                  {/* Right Column - Professional Information & Files */}
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Professional Information</h2>
                    
                    {/* Department */}
                    <div>
  <label
    htmlFor="department"
    className="block text-sm font-medium text-gray-700 mb-1"
  >
    Department
  </label>
  <select
    id="department"
    name="department"
    value={formData.department}
    onChange={handleChange}
    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
    required
  >
    <option value="">Select Department</option>
    <option value="HR">HR</option>
    <option value="Finance & Accounting">Finance & Accounting</option>
    <option value="Developer">Developer</option>
    <option value="Sales">Sales</option>
    <option value="Marketing">Marketing</option>
    <option value="Technical Support">Technical Support</option>
    <option value="Customer Support">Customer Support</option>
    <option value="Product Manager">Product Manager</option>
  </select>
</div>


                    {/* Salary */}
                    <div>
                      <label
                        htmlFor="salary"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Salary ($)
                      </label>
                      <input
                        type="number"
                        id="salary"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        placeholder="50000"
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        required
                      />
                    </div>

                    {/* Photo Upload & Preview */}
                    <div>
                      <label
                        htmlFor="photo"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Profile Photo
                      </label>
                      
                      {currentPhoto ? (
                        <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                          <p className="text-sm text-gray-600 mb-2">Photo Preview:</p>
                          <div className="flex items-center space-x-4">
                            <img 
                              src={currentPhoto} 
                              alt="Profile preview" 
                              className="h-24 w-24 rounded-full object-cover border-2 border-blue-200 shadow-sm" 
                            />
                            <button
                              type="button"
                              onClick={removePhoto}
                              className="text-sm text-red-600 hover:text-red-800 font-medium px-3 py-1 bg-red-50 rounded-md"
                            >
                           
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mb-4 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50 text-center">
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <p className="text-sm text-gray-600">No photo selected</p>
                        </div>
                      )}
                      
                      <input
                        type="file"
                        id="photo"
                        onChange={handlePhotoChange}
                        accept="image/*"
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      <p className="mt-1 text-xs text-gray-500">JPG, PNG or GIF (MAX. 5MB)</p>
                    </div>

                    {/* Document Upload & Preview */}
                    <div>
                      <label
                        htmlFor="document"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Document (PDF/DOC)
                      </label>
                      
                      {currentDocument ? (
                        <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                          <p className="text-sm text-gray-600 mb-2">Selected Document:</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="text-sm font-medium text-gray-700 truncate max-w-xs">{currentDocument}</span>
                            </div>
                            <button
                              type="button"
                              onClick={removeDocument}
                              className="text-sm text-red-600 hover:text-red-800 font-medium px-3 py-1 bg-red-50 rounded-md"
                            >
                           
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mb-4 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50 text-center">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                          </svg>
                          <p className="text-sm text-gray-600">No document selected</p>
                        </div>
                      )}
                      
                      <input
                        type="file"
                        id="document"
                        onChange={handleDocumentChange}
                        accept=".pdf,.doc,.docx"
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      <p className="mt-1 text-xs text-gray-500">PDF, DOC or DOCX (MAX. 10MB)</p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => navigate("/")}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      ← Back to employee list
                    </button>
                    
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        isLoading ? "opacity-75 cursor-not-allowed" : ""
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : isEditing ? (
                        "Update Employee"
                      ) : (
                        "Add Employee"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeForm;
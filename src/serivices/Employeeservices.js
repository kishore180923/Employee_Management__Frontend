import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api/employees";

// Get all employees
export const ListEmployees = async () => {
  return await axios.get(REST_API_BASE_URL);
};

// Add new employee (with image & document upload)
export const AddEmployee = async (employeeData) => {
  const formData = new FormData();

  // Append all text fields
  Object.keys(employeeData).forEach((key) => {
    if (key !== "photo" && key !== "document" && employeeData[key] !== undefined) {
      formData.append(key, employeeData[key]);
    }
  });

  // Append files
  if (employeeData.photo) {
    formData.append("photo", employeeData.photo);
  }
  if (employeeData.document) {
    formData.append("document", employeeData.document);
  }

  return await axios.post(REST_API_BASE_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Get employee by ID
export const GetEmployeeById = async (id) => {
  return await axios.get(`${REST_API_BASE_URL}/${id}`);
};

// Update employee (with optional new image & document)
export const UpdateEmployee = async (id, employeeData) => {
  const formData = new FormData();

  // Append text fields
  Object.keys(employeeData).forEach((key) => {
    if (key !== "photo" && key !== "document" && employeeData[key] !== undefined) {
      formData.append(key, employeeData[key]);
    }
  });

  // Append files only if provided
  if (employeeData.photo instanceof File) {
    formData.append("photo", employeeData.photo);
  }
  if (employeeData.document instanceof File) {
    formData.append("document", employeeData.document);
  }

  return await axios.put(`${REST_API_BASE_URL}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Delete employee
export const DeleteEmployee = async (id) => {
  return await axios.delete(`${REST_API_BASE_URL}/${id}`);
};

// Download employee document
export const DownloadEmployeeDocument = async (id) => {
  return await axios.get(`${REST_API_BASE_URL}/${id}/document`, {
    responseType: "blob",
  });
};

// Get employee photo (URL from backend)
export const GetEmployeePhotoUrl = (id) => {
  return `${REST_API_BASE_URL}/${id}/photo`;
};


export const GetEmployeeDocumentUrl = (id) => {
  return `${REST_API_BASE_URL}/${id}/document`;
};
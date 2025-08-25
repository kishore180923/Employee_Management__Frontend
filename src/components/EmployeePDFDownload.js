// src/components/EmployeePDFDownload.jsx
import React from "react";
import { FiDownload } from "react-icons/fi";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { GetEmployeePhotoUrl } from "../serivices/Employeeservices";
import { GetEmployeeDocumentUrl } from "../serivices/Employeeservices";

const EmployeePDFDownload = ({ employee }) => {
  const downloadEmployeePDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text("Employee Details", 105, 15, { align: "center" });

    // Add employee photo if exists
    if (employee.photo) {
      const img = new Image();
      img.src = GetEmployeePhotoUrl(employee.employeeId);
      img.onload = function () {
        doc.addImage(img, "JPEG", 15, 25, 30, 30);
        addEmployeeDetails(doc, 50);
      };
    } else {
      addEmployeeDetails(doc, 25);
    }

    function addEmployeeDetails(doc, startY) {
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text("ID:", 15, startY + 15);
      doc.text("Name:", 15, startY + 25);
      doc.text("Email:", 15, startY + 35);
      doc.text("Department:", 15, startY + 45);
      doc.text("Mobile:", 15, startY + 55);
      doc.text("Gender:", 15, startY + 65);
      doc.text("Address:", 15, startY + 70);
      doc.text("Date of Birth:", 15, startY + 80);
      doc.text("Salary:", 15, startY + 75);
      doc.text("Document:", 15, startY + 90);

      doc.setFont(undefined, "normal");
      doc.text(employee.employeeId.toString(), 40, startY + 15);
      doc.text(employee.employeeName, 40, startY + 25);
      doc.text(employee.email, 40, startY + 35);
      doc.text(employee.department, 40, startY + 45);
      doc.text(employee.mobileNumber, 40, startY + 55);
      doc.text(employee.gender, 40, startY + 65);
      doc.text(employee.address, 40, startY + 70);
      doc.text(employee.dateOfBirth, 40, startY + 80);
      doc.text(employee.salary.toString(), 40, startY + 75);
      doc.text(employee.document || "No document uploaded", 40, startY + 90);

      // Save PDF with employeeName_employeeID format
      const fileName = `${employee.employeeName}_${employee.employeeId}_details.pdf`;
      doc.save(fileName);
    }
  };

  return (
    <button
      onClick={downloadEmployeePDF}
      className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
      title="Download Employee Details PDF"
    >
      <FiDownload className="inline-block text-lg" />
    </button>
  );
};

export default EmployeePDFDownload;

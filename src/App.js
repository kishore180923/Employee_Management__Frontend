import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ListEmployeeComponent from './components/ListEmployeeComponent';
import AddEmployeeForm from './components/AddEmployee';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ListEmployeeComponent />} />
        <Route path="/list-employees" element={<ListEmployeeComponent />} />
        <Route path="/add-employee" element={<AddEmployeeForm />} />
        <Route path="/update-employee/:id" element={<AddEmployeeForm />} />
        {/* You can add more routes here later */}
      </Routes>
    </Router>
  );
}

export default App;

import React from 'react';
import './App.css'; // Import Bootstrap CSS
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import Home from './pages/Home';
import IssueBooks from './pages/IssueBooks';
import ReturnBooks from './pages/ReturnBooks';
import Pending from './pages/Pending';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/issue" element={<IssueBooks />} />   
        <Route path="/return" element={<ReturnBooks />} />   
        <Route path="/pending" element={<Pending />} />  
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;


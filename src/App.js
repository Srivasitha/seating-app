import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SeatingArrangement from './SeatingArrangement';
import BlockSetup from './BlockSetup';
import ClassLayoutList from './ClassLayoutList';
import ClassroomLayout from './ClassroomLayout'; // <-- 1. IMPORT THE NEW COMPONENT

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SeatingArrangement />} />
        <Route path="/block-setup" element={<BlockSetup />} />
        <Route path="/seating-plan" element={<ClassLayoutList />} />
        <Route path="/classroom-layout" element={<ClassroomLayout />} /> {/* <-- 2. ADD THE NEW ROUTE */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './components/SignIn';
import Dashboard from './components/Dashboard';

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/"  element={<SignIn />}/>
        <Route path="/home" element={<Dashboard />}/>
      </Routes>
    </div>
  );
}

export default App;

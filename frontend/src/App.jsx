import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import SetPassword from './pages/SetPassword';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/set-password" element={<SetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
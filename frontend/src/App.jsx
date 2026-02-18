import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import SetPassword from "./pages/SetPassword";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Boards from "./pages/Boards";
import Members from "./pages/Members";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Activity from "./pages/Activity";
import Cards from "./pages/Cards";
import CardBoards from "./pages/CardBoards";
import SettingPage from "./pages/SettingPage";
import BoardButton from "./pages/BoardButton";

import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/set-password" element={<SetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/home" element={<Home />} />
          <Route path="/boards" element={<Boards />} />
          <Route path="/members" element={<Members />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/cardBoards/:board_id" element={<CardBoards />} />
          <Route path="/settingPage" element={<SettingPage />} />
          <Route path="/boardbutton" element={<BoardButton />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AppLayout from "./pages/Applayout";

import ProtectedRoute from "./components/ProtectedRoute";
import DocumentEditor from "./pages/DocumentEditor";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        
    {/* Authenticated: wrap in <Route element={<ProtectedRoute />}> ... </Route> */}
    <Route element={<AppLayout />}>
      <Route path="/dashboard" element={<Dashboard view="mine" />} />
      <Route path="/dashboard/shared" element={<Dashboard view="shared" />} />
      <Route path="/dashboard/trash" element={<Dashboard view="trash" />} />
      <Route path="/documents/:id" element={<DocumentEditor />} />
    </Route>
  </Routes>
    </BrowserRouter>
  );
};

export default App;
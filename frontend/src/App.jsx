import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "./landing/PublicLayout";
import Register from "./landing/pages/Register";
import Login from "./landing/pages/Login";
import { AuthProvider } from "./context/AuthProvider";
import DashboardLayout from "./dashboard/DashboardLayout";
import Users from "./dashboard/pages/Users";
import Posts from "./dashboard/pages/Posts";

import "./index.css"; // Tailwind import
import ProtectedRoute from "./routes/ProtectedRoute";
import Permissions from "./dashboard/pages/Permissions";
import Roles from "./dashboard/pages/Roles";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Dashboard */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>

            <Route path="users" element={
              <ProtectedRoute permission="user.view">
                <Users />
              </ProtectedRoute>
            } />
            <Route path="posts" element={
              <ProtectedRoute permission="post.view">
                <Posts />
              </ProtectedRoute>
            } />
            <Route path="Permissions" element={
              <ProtectedRoute permission="permission.view">
              <Permissions />
              </ProtectedRoute>
            } />
            <Route path="roles" element={
              <ProtectedRoute permission="role.view">
                <Roles />
              </ProtectedRoute>
            } />

          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

// import { AuthProvider } from "./context/AuthContext";
// import LoginForm from "./pages/LoginForm";
// import RegisterForm from "./pages/RegisterForm";
// import UserList from "./pages/userList";

// function App() {
//   return (
//     <AuthProvider>
//       <div className="min-h-screen bg-gray-100 p-4">
//         <h1 className="text-3xl font-bold text-center mb-6">User Management</h1>
//         <div className="flex justify-around flex-wrap gap-6">
//           <RegisterForm />
//           <LoginForm />
//         </div>
//         <UserList />
//       </div>
//     </AuthProvider>
//   );
// }

// export default App;

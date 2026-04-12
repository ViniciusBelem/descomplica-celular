import { createBrowserRouter } from "react-router-dom";
import { Home } from "../pages/Home";
import { Phones } from "../pages/Phones";
import { PhoneDetail } from "../pages/PhoneDetail";
import { Admin } from "../pages/Admin";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { Library } from "../pages/Library";
import { Analytics } from "../pages/Analytics";
import { Settings } from "../pages/Settings";
import { ComingSoon } from "../pages/ComingSoon";
import Layout from "../components/Layout";
import AdminLayout from "../components/AdminLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";

/**
 * Global Router Setup (React Router v7 Pattern)
 */
export const router = createBrowserRouter([
  // -- PUBLIC ROUTES --
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      { 
        path: "phones", 
        element: <Phones /> 
      },
      { 
        path: "phones/:id", 
        element: <PhoneDetail /> 
      },
      { path: "library", element: <Library /> },
      { path: "analytics", element: <Analytics /> },
      { path: "settings", element: <Settings /> },
      // Fallback 404
      { path: "*", element: <ComingSoon /> }
    ]
  },
  // -- AUTH ROUTES --
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  // -- PRIVATE ADMIN ROUTES --
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Admin />
      }
    ]
  }
]);

import { createBrowserRouter } from "react-router-dom";
import { Home } from "../pages/Home";
import { Phones } from "../pages/Phones";
import { PhoneDetail } from "../pages/PhoneDetail";
import { Admin } from "../pages/Admin";
import { Login } from "../pages/Login";
import { ComingSoon } from "../pages/ComingSoon";
import Layout from "../components/Layout";
import AdminLayout from "../components/AdminLayout";

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
      { path: "library", element: <ComingSoon /> },
      { path: "analytics", element: <ComingSoon /> },
      { path: "settings", element: <ComingSoon /> },
      // Fallback 404
      { path: "*", element: <ComingSoon /> }
    ]
  },
  // -- AUTH ROUTE --
  {
    path: "/login",
    element: <Login />
  },
  // -- PRIVATE ADMIN ROUTES --
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Admin />
      }
    ]
  }
]);

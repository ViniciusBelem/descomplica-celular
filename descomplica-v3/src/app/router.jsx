import { createBrowserRouter } from "react-router-dom";
import { Home } from "../pages/Home";
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
      // Tratamento para os links fantasmas da Sidebar
      { path: "explore", element: <ComingSoon /> },
      { path: "library", element: <ComingSoon /> },
      { path: "analytics", element: <ComingSoon /> },
      { path: "settings", element: <ComingSoon /> },
      // Fallback 404 (Tudo que não existir)
      { path: "*", element: <ComingSoon /> }
    ]
  },
  // -- AUTH ROUTE (Unprotected shell) --
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

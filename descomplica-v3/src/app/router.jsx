import { createBrowserRouter } from "react-router-dom";
import { Home } from "../pages/Home";
import { Admin } from "../pages/Admin";
import { AdminSettings } from "../pages/AdminSettings";
import { Login } from "../pages/Login";
import { Catalog } from "../pages/Catalog";
import { Library } from "../pages/Library";
import { Compare } from "../pages/Compare";
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
        path: "catalog",
        element: <Catalog />
      },
      {
        path: "library",
        element: <Library />
      },
      {
        path: "compare",
        element: <Compare />
      },
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
      },
      {
        path: "settings",
        element: <AdminSettings />
      }
    ]
  }
]);

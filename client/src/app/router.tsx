import {createBrowserRouter} from "react-router-dom"
import ProtectedRoute from "../components/ProtectedRoute"
import {LandingPage , LoginPage,RegisterPage,MainLayout,CitizenLayout} from './route'
import CitizenDashboard from "../pages/citizen/CitizenDashboard"
import LawyerDashboard from "../pages/lawyer/LawyerDashboard"
export const router = createBrowserRouter([
    {
      path:'/',
      element:<LandingPage />
    },
    { 
      path:'/login',
      element:<LoginPage />
    },
    {
      path:'/register',
      element:<RegisterPage />
    },
    {
      path:'/dashboard/lawyer',
      element:<ProtectedRoute allowedRole="lawyer"><LawyerDashboard /></ProtectedRoute>
    },

    {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
  {
    path: "/dashboard/citizen",
    element: (
      <ProtectedRoute allowedRole="citizen">
        <CitizenLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <CitizenDashboard /> },
    ],
  },
    // {
    //  path:'/citizen',
    //  element:<CitizenLayout />,
    //  children:[
    //     {path:"dashboard",element:<CitizenDashboard />},
    //     {path:"case-search",element:<CaseSearchPage />},
    //     {path:"lawyers",element:<LawyersPage />}
    //  ]
    // }
])
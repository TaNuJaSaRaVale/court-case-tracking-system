import {createBrowserRouter} from "react-router-dom"
import ProtectedRoute from "../components/ProtectedRoute"
import {LandingPage , LoginPage,RegisterPage,MainLayout,CitizenLayout,LawyerLayout} from './route'
import CitizenDashboard from "../pages/citizen/CitizenDashboard"
import LawyerDashboard from "../pages/lawyer/LawyerDashboard"
import ClientPage from "../pages/lawyer/ClientsPage"
import NyaySetuDocuments from "../pages/citizen/document"
import NyayaSetuSettingsApp from "../components/shared/settings"
import HireLawyerPage from "../pages/citizen/LawyersPage"
import MyCases from "../pages/citizen/CaseDetailPage"
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
      path:'/citizen',
      element:<CitizenLayout />,
      children:[
        {path:"dashboard",element:<CitizenDashboard />},
        {path:"mycases",element:<MyCases />},
        {path:"documents",element:<NyaySetuDocuments />},
        {path:"settings",element:<NyayaSetuSettingsApp />},
        {path:"hirelawyer",element:<HireLawyerPage />},
      ]
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
    path: "/lawyer",
    element: (
      <ProtectedRoute allowedRole="lawyer">
        <LawyerLayout />
      </ProtectedRoute>
    ),
    children: [
        {path:"dashboard",element:<LawyerDashboard />},
        {path:"clientPage",element:<ClientPage />}
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
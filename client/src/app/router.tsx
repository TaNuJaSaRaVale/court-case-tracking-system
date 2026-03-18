import {createBrowserRouter} from "react-router-dom"

import LandingPage from "C:\\Projects\\hackathons\\court-case-tracker\\court-case-tracking-system\\client\\src\\pages\\landing\\LandingPage.tsx"
// import LoginPage from "C:\\Projects\\hackathons\\court-case-tracker\\court-case-tracking-system\\client\\src\\pages\\auth\\LoginPage.tsx"
// import CitizenDashboard from "C:\\Projects\\hackathons\\court-case-tracker\\court-case-tracking-system\\client\\src\\pages\\citizen\\CitizenDashboard.tsx"
// import LawyersPage from "C:\\Projects\\hackathons\\court-case-tracker\\court-case-tracking-system\\client\\src\\pages\\citizen\\LawyersPage.tsx"
// import CitizenLayout from "C:\\Projects\\hackathons\\court-case-tracker\\court-case-tracking-system\\client\\src\\components\\layout\\CitizenLayout.tsx"
// import CaseSearchPage from "C:\\Projects\\hackathons\\court-case-tracker\\court-case-tracking-system\\client\\src\\pages\\citizen\\CaseSearchPage.tsx"

export const router = createBrowserRouter([
    {
      path:'/',
      element:<LandingPage />
    },
    // { 
    //   path:'/login',
    //   element:<LoginPage />
    // },
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
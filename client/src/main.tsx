import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router.tsx'

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)

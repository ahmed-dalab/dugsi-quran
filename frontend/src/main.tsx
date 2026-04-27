import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from "react-redux"
import { Toaster } from "sonner"
import './index.css'
// imports 
import { store } from '@/app/store'
import { RouterProvider } from 'react-router'
import { router } from '@/router/index'
import AuthBootstrap from './features/auth/components/AuthBootstrap'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthBootstrap>
        <RouterProvider router={router} />
        <Toaster 
          position="top-right"
          richColors
          closeButton
          expand={false}
        />
      </AuthBootstrap>
    </Provider>
  </StrictMode>,
)

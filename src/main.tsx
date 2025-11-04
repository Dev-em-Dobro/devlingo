import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import { UserPreferencesProvider } from './contexts/UserPreferencesContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <UserPreferencesProvider>
        <App />
      </UserPreferencesProvider>
    </AuthProvider>
  </React.StrictMode>,
)


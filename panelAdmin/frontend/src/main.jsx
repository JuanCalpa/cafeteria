import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import React from 'react'

// Simple AuthProvider example (replace with your auth logic, e.g., using a library like Auth0)
const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false); // Replace with actual auth check
  // Add login/logout functions as needed
  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App />
  </AuthProvider>
)

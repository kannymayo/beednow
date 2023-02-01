import './App.css'
import 'react-toastify/dist/ReactToastify.css'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './store/AuthContext'
import { ToastContainer } from 'react-toastify'

import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

import Home from './layout/Home'

const qc = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
  },
})

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <QueryClientProvider client={qc}>
            <Home />
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </AuthProvider>
      </BrowserRouter>
      <ToastContainer position="bottom-right" autoClose={1500} />
    </>
  )
}

export default App

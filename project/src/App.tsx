import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './store/AuthContext'
import './App.css'

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
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider client={qc}>
          <Home />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

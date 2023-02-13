import './App.css'
import 'react-toastify/dist/ReactToastify.css'
import { StrictMode } from 'react'
import { ToastContainer } from 'react-toastify'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import Home from '@/layout/Home'

const qc = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      cacheTime: 1 * 60 * 60 * 1000,
      staleTime: 1 * 60 * 60 * 1000,
      refetchOnMount: false,
      retryOnMount: false,
    },
  },
})

function App() {
  return (
    <StrictMode>
      <QueryClientProvider client={qc}>
        <Home />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
      <ToastContainer
        position="bottom-right"
        autoClose={1600}
        newestOnTop
        pauseOnFocusLoss={false}
      />
    </StrictMode>
  )
}

export default App

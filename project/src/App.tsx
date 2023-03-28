import './App.css'
import 'react-toastify/dist/ReactToastify.css'
import { StrictMode } from 'react'
import { ToastContainer } from 'react-toastify'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import Routes from '@/layout/Routes'

export const qc = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 1 * 60 * 60 * 1000,
      staleTime: 1 * 60 * 60 * 1000,
      refetchOnMount: false,
      retryOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <StrictMode>
      <QueryClientProvider client={qc}>
        <Routes />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
      <ToastContainer
        enableMultiContainer
        containerId="default"
        autoClose={1600}
        newestOnTop
        pauseOnFocusLoss={false}
      />
    </StrictMode>
  )
}

export default App

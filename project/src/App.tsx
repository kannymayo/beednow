import './App.css'
import 'react-toastify/dist/ReactToastify.css'
import { StrictMode } from 'react'
import { useAtomsDevtools } from 'jotai-devtools'
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
    <StrictMode>
      <QueryClientProvider client={qc}>
        <AtomsDevTools>
          <Home />
        </AtomsDevTools>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
      <ToastContainer position="bottom-right" autoClose={1600} />
    </StrictMode>
  )
}

function AtomsDevTools({ children }: { children: any }) {
  useAtomsDevtools('jotai')
  return children
}

export default App

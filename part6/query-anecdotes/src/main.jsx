import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AnecdotesContextProvider } from './AnecdotesContext'
import App from './App'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <AnecdotesContextProvider >
      <App />
    </AnecdotesContextProvider> 
  </QueryClientProvider>
)
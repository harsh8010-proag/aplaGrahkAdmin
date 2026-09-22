import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { Toaster } from 'react-hot-toast'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AuthGate from './Authgate.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <AuthGate>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <HashRouter>
          <App />
        </HashRouter>
      </AuthGate>
    </Provider>
  </StrictMode>,
)

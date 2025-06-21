import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { GroupProvider } from './context/GroupContext.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <GroupProvider>
                <App />
            </GroupProvider>
        </BrowserRouter>
    </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { GroupProvider } from './context/GroupProvider.tsx'
import { UserProvider } from './context/UserProvider.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <GroupProvider>
                <UserProvider>
                    <App />
                </UserProvider>
            </GroupProvider>
        </BrowserRouter>
    </StrictMode>
)

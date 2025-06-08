import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import NavBarComponent from './components/NavBar'
import { Routes, Route } from 'react-router-dom'
import Home from './routes/Home'
import Groups from './routes/Groups'

function App() {
    return (
        <>
            <NavBarComponent />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/groups" element={<Groups />} />
            </Routes>
        </>
    )
}

export default App

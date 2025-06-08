import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import NavBarComponent from './components/NavBar'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Groups from './pages/Groups'
import ManageGroup from './pages/ManageGroup'

function App() {
    return (
        <>
            <NavBarComponent />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/groups/:groupId" element={<ManageGroup />} />
            </Routes>
        </>
    )
}

export default App

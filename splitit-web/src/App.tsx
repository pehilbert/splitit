import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import NavBarComponent from './components/NavBar'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Groups from './pages/Groups'
import ManageGroup from './pages/ManageGroup'
import ManageExpense from './pages/ManageExpense'
import SignIn from './pages/SignIn'

function App() {
    return (
        <>
            <NavBarComponent />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/groups/:groupId" element={<ManageGroup />} />
                <Route path="/groups/:groupId/:expenseId" element={<ManageExpense />} />
                <Route path="/signin" element={<SignIn />} />
            </Routes>
        </>
    )
}

export default App

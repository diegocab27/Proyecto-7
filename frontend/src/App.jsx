import Signup from './pages/signup'
import Home from './pages/home'
import Login from './pages/login'
import Profile from './pages/profile'
import Checkout from './pages/checkout'
import Payed from './pages/payed'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';




function App() {
  return (
    <Router>
      <Routes>
      <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/checkout' element={<Checkout/>}/>
        <Route path='/payed' element={<Payed/>}/>
      </Routes>
    </Router>
  )
}

export default App;
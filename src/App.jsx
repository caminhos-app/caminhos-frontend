import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Cadastro    from './pages/Cadastro'
import Login       from './pages/Login'
import Onboarding  from './pages/Onboarding'
import Teste       from './pages/Teste'
import Resultado   from './pages/Resultado'
import Home        from './pages/Home'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<LandingPage />} />
        <Route path="/cadastro"   element={<Cadastro />} />
        <Route path="/login"      element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/teste"      element={<Teste />} />
        <Route path="/resultado/:sessao_id" element={<Resultado />} />
        <Route path="/home"       element={<Home />} />
        <Route path="/skyai"      element={<div style={{padding:'2rem',fontFamily:'sans-serif'}}>SkyAI — em breve</div>} />
        <Route path="/manifesto"  element={<div style={{padding:'2rem',fontFamily:'sans-serif'}}>Manifesto — em breve</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

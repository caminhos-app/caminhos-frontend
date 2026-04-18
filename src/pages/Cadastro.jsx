import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import './Auth.css'

export default function Cadastro() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name:           '',
    email:          '',
    password:       '',
    accepted_terms: false,
  })
  const [erro,      setErro]      = useState('')
  const [loading,   setLoading]   = useState(false)

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    if (!form.name.trim())           return setErro('Informe seu nome.')
    if (!form.email.trim())          return setErro('Informe seu e-mail.')
    if (form.password.length < 8)    return setErro('A senha deve ter no mínimo 8 caracteres.')
    if (!form.accepted_terms)        return setErro('Você precisa aceitar os termos de uso.')

    setLoading(true)
    try {
      const { data } = await api.post('/auth/cadastro', form)
      localStorage.setItem('token',   data.access_token)
      localStorage.setItem('refresh', data.refresh_token)
      localStorage.setItem('usuario', JSON.stringify(data.usuario))
      navigate('/onboarding')
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao criar conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-root">
      <div className="auth-card">

        {/* Logo */}
        <Link to="/" className="auth-logo">Caminhos</Link>
        <p className="auth-sub">Sua jornada começa aqui.</p>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="auth-form">

          <div className="auth-field">
            <label>Nome completo</label>
            <input
              type="text"
              name="name"
              placeholder="Como você se chama?"
              value={form.name}
              onChange={handleChange}
              autoFocus
            />
          </div>

          <div className="auth-field">
            <label>E-mail</label>
            <input
              type="email"
              name="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="auth-field">
            <label>Senha</label>
            <input
              type="password"
              name="password"
              placeholder="Mínimo 8 caracteres"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <label className="auth-checkbox">
            <input
              type="checkbox"
              name="accepted_terms"
              checked={form.accepted_terms}
              onChange={handleChange}
            />
            <span>
              Aceito os <a href="/termos" target="_blank">termos de uso</a> e a{' '}
              <a href="/privacidade" target="_blank">política de privacidade</a>
            </span>
          </label>

          {erro && <p className="auth-erro">{erro}</p>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Criando sua conta...' : 'Criar minha conta →'}
          </button>

        </form>

        <p className="auth-link">
          Já tem conta?{' '}
          <Link to="/login">Entrar</Link>
        </p>

      </div>
    </div>
  )
}

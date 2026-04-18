import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import './Auth.css'

export default function Login() {
  const navigate = useNavigate()

  const [form, setForm]     = useState({ email: '', password: '' })
  const [erro, setErro]     = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    if (!form.email.trim())    return setErro('Informe seu e-mail.')
    if (!form.password.trim()) return setErro('Informe sua senha.')

    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      localStorage.setItem('token',   data.access_token)
      localStorage.setItem('refresh', data.refresh_token)
      localStorage.setItem('usuario', JSON.stringify(data.usuario))
      navigate('/home')
    } catch (err) {
      setErro(err.response?.data?.erro || 'E-mail ou senha inválidos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-root">
      <div className="auth-card">

        <Link to="/" className="auth-logo">Caminhos</Link>
        <p className="auth-sub">Bem-vindo de volta. 💜</p>

        <form onSubmit={handleSubmit} className="auth-form">

          <div className="auth-field">
            <label>E-mail</label>
            <input
              type="email"
              name="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={handleChange}
              autoFocus
            />
          </div>

          <div className="auth-field">
            <label>Senha</label>
            <input
              type="password"
              name="password"
              placeholder="Sua senha"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div style={{ textAlign: 'right' }}>
            <Link
              to="/esqueci-senha"
              style={{ fontSize: '13px', color: 'var(--roxo-medio)', textDecoration: 'none' }}
            >
              Esqueci minha senha
            </Link>
          </div>

          {erro && <p className="auth-erro">{erro}</p>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar →'}
          </button>

        </form>

        <p className="auth-link">
          Ainda não tem conta?{' '}
          <Link to="/cadastro">Criar gratuitamente</Link>
        </p>

      </div>
    </div>
  )
}

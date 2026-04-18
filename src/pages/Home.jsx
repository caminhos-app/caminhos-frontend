import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import './Home.css'

export default function Home() {
  const navigate  = useNavigate()
  const [usuario, setUsuario] = useState(null)
  const [sessoes, setSessoes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const u = localStorage.getItem('usuario')
    if (u) setUsuario(JSON.parse(u))
    buscarHistorico()
  }, [])

  async function buscarHistorico() {
    try {
      const { data } = await api.get('/sessoes/historico')
      setSessoes(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function sair() {
    localStorage.clear()
    navigate('/')
  }

  const ultimaSessao = sessoes.find(s => s.mbti) || null
  const nome = usuario?.name?.split(' ')[0] || 'você'

  return (
    <div className="home-root">
      <div className="home-container">

        {/* Nav */}
        <nav className="home-nav">
          <span className="home-logo">Caminhos</span>
          <button className="home-sair" onClick={sair}>Sair</button>
        </nav>

        {/* Saudação */}
        <section className="home-hero">
          <div className="home-hero-glow" />
          <p className="home-saudacao">Bem-vindo de volta,</p>
          <h1 className="home-nome">{nome} ✨</h1>
          <p className="home-missao">Cada dia é uma oportunidade de se conhecer melhor.</p>
        </section>

        {/* Perfil atual */}
        {ultimaSessao ? (
          <section className="home-section">
            <p className="home-section-label">Seu perfil atual</p>
            <div className="home-perfil-card">
              <div className="home-perfil-item">
                <span className="home-perfil-tipo">MBTI</span>
                <span className="home-perfil-valor">{ultimaSessao.mbti || '—'}</span>
              </div>
              <div className="home-perfil-item">
                <span className="home-perfil-tipo">DISC</span>
                <span className="home-perfil-valor">{ultimaSessao.disc || '—'}</span>
              </div>
              <div className="home-perfil-item">
                <span className="home-perfil-tipo">Eneagrama</span>
                <span className="home-perfil-valor">{ultimaSessao.eneagrama?.split(' ')[0] || '—'}</span>
              </div>
            </div>
            <button
              className="home-btn-ver"
              onClick={() => navigate(`/resultado/${ultimaSessao.id}`)}
            >
              Ver meu resultado completo →
            </button>
          </section>
        ) : (
          <section className="home-section">
            <div className="home-comecar-card">
              <span className="home-comecar-emoji">🧠</span>
              <h2 className="home-comecar-titulo">Pronto para se descobrir?</h2>
              <p className="home-comecar-desc">Faça o teste adaptativo e descubra seu perfil MBTI, DISC e Eneagrama em ~20 minutos.</p>
              <button
                className="home-btn-cta"
                onClick={() => navigate('/teste')}
              >
                Começar meu teste →
              </button>
            </div>
          </section>
        )}

        {/* Módulos */}
        <section className="home-section">
          <p className="home-section-label">Sua jornada</p>
          <div className="home-modulos">

            <div
              className="home-modulo-card"
              onClick={() => navigate(ultimaSessao ? '/teste' : '/teste')}
            >
              <div className="home-modulo-icon home-icon-teal">🧠</div>
              <div>
                <p className="home-modulo-titulo">YouDecodedAI</p>
                <p className="home-modulo-desc">MBTI · DISC · Eneagrama</p>
              </div>
              <span className={`home-modulo-status ${ultimaSessao ? 'feito' : 'pendente'}`}>
                {ultimaSessao ? '✓' : '→'}
              </span>
            </div>

            <div
              className="home-modulo-card"
              onClick={() => navigate('/skyai')}
            >
              <div className="home-modulo-icon home-icon-purple">✨</div>
              <div>
                <p className="home-modulo-titulo">SkyAI</p>
                <p className="home-modulo-desc">Mapa astral · Numerologia</p>
              </div>
              <span className="home-modulo-status pendente">→</span>
            </div>

            <div
              className="home-modulo-card"
              onClick={() => navigate('/manifesto')}
            >
              <div className="home-modulo-icon home-icon-amber">🙏</div>
              <div>
                <p className="home-modulo-titulo">Manifesto</p>
                <p className="home-modulo-desc">Objeto de intenção 3D</p>
              </div>
              <span className="home-modulo-status pendente">→</span>
            </div>

          </div>
        </section>

        {/* Histórico */}
        {sessoes.length > 1 && (
          <section className="home-section">
            <p className="home-section-label">Histórico</p>
            <div className="home-historico">
              {sessoes.slice(0, 5).map(s => (
                <div
                  key={s.id}
                  className="home-historico-item"
                  onClick={() => navigate(`/resultado/${s.id}`)}
                >
                  <span className="home-historico-mbti">{s.mbti || '—'}</span>
                  <span className="home-historico-data">
                    {new Date(s.created_at).toLocaleDateString('pt-BR')}
                  </span>
                  <span className="home-historico-arrow">→</span>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import './Onboarding.css'

const OBJETIVOS = [
  { id: 'autoconhecimento', emoji: '🧠', titulo: 'Me conhecer melhor', desc: 'Entender meus padrões, forças e pontos cegos' },
  { id: 'espiritualidade',  emoji: '✨', titulo: 'Crescimento espiritual', desc: 'Conectar com algo maior e minha missão de vida' },
  { id: 'prosperidade',     emoji: '🌟', titulo: 'Prosperar', desc: 'Alinhar minha vida interior com conquistas reais' },
  { id: 'relacionamentos',  emoji: '💞', titulo: 'Relacionamentos', desc: 'Entender como me relaciono e o que busco nos outros' },
  { id: 'proposito',        emoji: '🧭', titulo: 'Encontrar propósito', desc: 'Descobrir o que realmente importa para mim' },
  { id: 'saude_mental',     emoji: '🌿', titulo: 'Saúde mental', desc: 'Cuidar da minha mente e equilíbrio emocional' },
]

const ESTILOS = [
  { id: 'direto',     emoji: '⚡', titulo: 'Direto e objetivo', desc: 'Prefiro respostas claras, sem rodeios' },
  { id: 'acolhedor', emoji: '💜', titulo: 'Acolhedor e detalhado', desc: 'Prefiro um tom mais suave e aprofundado' },
]

export default function Onboarding() {
  const navigate    = useNavigate()
  const [etapa,     setEtapa]    = useState(1)
  const [objetivo,  setObjetivo] = useState('')
  const [estilo,    setEstilo]   = useState('')
  const [loading,   setLoading]  = useState(false)
  const [erro,      setErro]     = useState('')

  async function finalizar() {
    setErro('')
    setLoading(true)
    try {
      await api.post('/auth/atualizar-onboarding', {
        onboarding_goal:     objetivo,
        communication_style: estilo,
      })
      navigate('/teste')
    } catch (err) {
      setErro('Erro ao salvar preferências. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ob-root">
      <div className="ob-card">

        {/* Progresso */}
        <div className="ob-progress">
          <div className="ob-progress-bar" style={{ width: etapa === 1 ? '50%' : '100%' }} />
        </div>

        <span className="ob-logo">Caminhos</span>
        <p className="ob-etapa-label">Passo {etapa} de 2</p>

        {/* ETAPA 1 — Objetivo */}
        {etapa === 1 && (
          <div className="ob-etapa">
            <h1 className="ob-titulo">O que te trouxe aqui?</h1>
            <p className="ob-sub">Escolha o que mais ressoa com você agora. Pode mudar depois.</p>

            <div className="ob-grid">
              {OBJETIVOS.map(o => (
                <button
                  key={o.id}
                  className={`ob-opcao ${objetivo === o.id ? 'ob-opcao-ativa' : ''}`}
                  onClick={() => setObjetivo(o.id)}
                >
                  <span className="ob-emoji">{o.emoji}</span>
                  <span className="ob-opcao-titulo">{o.titulo}</span>
                  <span className="ob-opcao-desc">{o.desc}</span>
                </button>
              ))}
            </div>

            <button
              className="ob-btn"
              disabled={!objetivo}
              onClick={() => setEtapa(2)}
            >
              Continuar →
            </button>
          </div>
        )}

        {/* ETAPA 2 — Estilo de comunicação */}
        {etapa === 2 && (
          <div className="ob-etapa">
            <h1 className="ob-titulo">Como prefere receber seus insights?</h1>
            <p className="ob-sub">Vamos personalizar sua experiência do jeito que funciona melhor para você.</p>

            <div className="ob-grid ob-grid-2">
              {ESTILOS.map(e => (
                <button
                  key={e.id}
                  className={`ob-opcao ${estilo === e.id ? 'ob-opcao-ativa' : ''}`}
                  onClick={() => setEstilo(e.id)}
                >
                  <span className="ob-emoji">{e.emoji}</span>
                  <span className="ob-opcao-titulo">{e.titulo}</span>
                  <span className="ob-opcao-desc">{e.desc}</span>
                </button>
              ))}
            </div>

            {erro && <p className="ob-erro">{erro}</p>}

            <div className="ob-botoes">
              <button className="ob-btn-voltar" onClick={() => setEtapa(1)}>
                ← Voltar
              </button>
              <button
                className="ob-btn"
                disabled={!estilo || loading}
                onClick={finalizar}
              >
                {loading ? 'Salvando...' : 'Começar meu teste →'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
    
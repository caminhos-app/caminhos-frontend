import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import './Teste.css'

export default function Teste() {
  const navigate = useNavigate()

  const [sessaoId,    setSessaoId]    = useState(null)
  const [pergunta,    setPergunta]    = useState(null)
  const [respondidas, setRespondidas] = useState([])
  const [progresso,   setProgresso]   = useState(0)
  const [modulo,      setModulo]      = useState('MBTI')
  const [valor,       setValor]       = useState(50)
  const [loading,     setLoading]     = useState(true)
  const [salvando,    setSalvando]    = useState(false)
  const [erro,        setErro]        = useState('')
  const [concluido,   setConcluido]   = useState(false)

  useEffect(() => { iniciarSessao() }, [])

  async function iniciarSessao() {
    try {
      const { data: ativa } = await api.get('/sessoes/ativa')
      if (ativa.sessao) {
        setSessaoId(ativa.sessao.id)
        setRespondidas(ativa.sessao.respondidas)
        await buscarProxima(ativa.sessao.id, ativa.sessao.respondidas)
      } else {
        const { data } = await api.post('/sessoes/iniciar')
        setSessaoId(data.sessao_id)
        await buscarProxima(data.sessao_id, [])
      }
    } catch (err) {
      setErro('Erro ao iniciar o teste. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  async function buscarProxima(sid, resp) {
    try {
      const { data } = await api.post('/questions/proxima', {
        session_id:  sid,
        respondidas: resp,
        tipo_atual:  modulo,
      })
      if (data.concluido) {
        await concluirTeste(sid)
        return
      }
      setPergunta(data.pergunta)
      setProgresso(data.progresso || 0)
      setModulo(data.modulo_atual || 'MBTI')
      setValor(50)
    } catch (err) {
      setErro('Erro ao buscar próxima pergunta.')
    }
  }

  async function responder() {
    if (!pergunta || !sessaoId) return
    setSalvando(true)
    setErro('')
    try {
      await api.post('/respostas', {
        sessao_id:   sessaoId,
        question_id: pergunta.id,
        answer:      valor,
      })
      const novas = [...respondidas, pergunta.id]
      setRespondidas(novas)
      await buscarProxima(sessaoId, novas)
    } catch (err) {
      setErro('Erro ao salvar resposta. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  async function concluirTeste(sid) {
    try {
      setConcluido(true)
      await api.post(`/sessoes/${sid}/concluir`)
      await api.post('/relatorio/gerar', { sessao_id: sid })
      navigate(`/resultado/${sid}`)
    } catch (err) {
      setErro('Erro ao concluir o teste.')
    }
  }

  if (loading) return (
    <div className="teste-root">
      <div className="teste-loading">
        <div className="teste-spinner" />
        <p>Preparando seu teste...</p>
      </div>
    </div>
  )

  if (concluido) return (
    <div className="teste-root">
      <div className="teste-loading">
        <div className="teste-spinner" />
        <p>Gerando seu perfil único...</p>
        <p className="teste-loading-sub">Isso pode levar alguns segundos ✨</p>
      </div>
    </div>
  )

  if (erro && !pergunta) return (
    <div className="teste-root">
      <div className="teste-erro-full">
        <p>{erro}</p>
        <button onClick={iniciarSessao}>Tentar novamente</button>
      </div>
    </div>
  )

  const labelEsq = pergunta?.label_esq || pergunta?.label_left  || 'Discordo'
  const labelDir = pergunta?.label_dir || pergunta?.label_right || 'Concordo'

  return (
    <div className="teste-root">
      <div className="teste-card">

        {/* Header */}
        <div className="teste-header">
          <span className="teste-logo">Caminhos</span>
          <span className="teste-badge">{modulo}</span>
        </div>

        {/* Progresso */}
        <div className="teste-progress">
          <div className="teste-progress-bar" style={{ width: `${progresso}%` }} />
        </div>
        <p className="teste-progresso-label">{progresso}% concluído</p>

        {/* Pergunta */}
        {pergunta && (
          <div className="teste-corpo">
            <h2 className="teste-pergunta">
              {pergunta.texto || pergunta.text}
            </h2>

            {/* Labels */}
            <div className="teste-labels">
              <span className={`teste-label ${valor <= 30 ? 'ativa' : ''}`}>
                {labelEsq}
              </span>
              <span className={`teste-label ${valor >= 70 ? 'ativa' : ''}`}>
                {labelDir}
              </span>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="0"
              max="100"
              value={valor}
              onChange={e => setValor(Number(e.target.value))}
              className="teste-slider"
            />

            {/* Indicador */}
            <div className="teste-indicador">
              {valor < 35  && <span>👈 <strong>{labelEsq}</strong></span>}
              {valor >= 35 && valor <= 65 && <span>Neutro — depende do contexto</span>}
              {valor > 65  && <span><strong>{labelDir}</strong> 👉</span>}
            </div>

            {erro && <p className="teste-erro">{erro}</p>}

            <button
              className="teste-btn"
              onClick={responder}
              disabled={salvando}
            >
              {salvando ? 'Salvando...' : 'Próxima pergunta →'}
            </button>

          </div>
        )}

      </div>
    </div>
  )
}

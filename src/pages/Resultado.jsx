import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import './Resultado.css'

const DESCRICOES_MBTI = {
  INTJ: 'Estrategista Visionário', INTP: 'Pensador Lógico',
  ENTJ: 'Líder Nato',              ENTP: 'Inovador Debatedor',
  INFJ: 'Conselheiro Visionário',  INFP: 'Idealista Mediador',
  ENFJ: 'Protagonista Inspirador', ENFP: 'Ativista Criativo',
  ISTJ: 'Executor Confiável',      ISFJ: 'Protetor Dedicado',
  ESTJ: 'Administrador Eficiente', ESFJ: 'Cuidador Social',
  ISTP: 'Artesão Prático',         ISFP: 'Aventureiro Sensível',
  ESTP: 'Empreendedor Dinâmico',   ESFP: 'Animador Espontâneo',
}

export default function Resultado() {
  const { sessao_id } = useParams()
  const navigate      = useNavigate()

  const [parcial,  setParcial]  = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [erro,     setErro]     = useState('')
  const [pagando,  setPagando]  = useState(false)

  useEffect(() => {
    buscarResultado()
  }, [sessao_id])

  async function buscarResultado() {
    try {
      const { data } = await api.get(`/relatorio/parcial/${sessao_id}`)
      setParcial(data)
    } catch (err) {
      setErro('Erro ao carregar seu resultado.')
    } finally {
      setLoading(false)
    }
  }

  async function iniciarPagamento() {
    setPagando(true)
    try {
      const { data } = await api.post('/pagamento/pix', {
        produto:       'relatorio',
        referencia_id: parseInt(sessao_id),
      })
      navigate(`/pagamento/${data.pagamento_id}`, {
        state: {
          qr_code:        data.qr_code,
          qr_code_base64: data.qr_code_base64,
          valor:          data.valor,
          produto:        'relatorio',
          referencia_id:  sessao_id,
        }
      })
    } catch (err) {
      setErro('Erro ao iniciar pagamento. Tente novamente.')
    } finally {
      setPagando(false)
    }
  }

  if (loading) return (
    <div className="res-root">
      <div className="res-loading">
        <div className="res-spinner" />
        <p>Carregando seu resultado...</p>
      </div>
    </div>
  )

  if (erro) return (
    <div className="res-root">
      <div className="res-erro"><p>{erro}</p></div>
    </div>
  )

  const mbti     = parcial?.perfil?.mbti      || ''
  const disc     = parcial?.perfil?.disc      || ''
  const eneagrama = parcial?.perfil?.eneagrama || ''
  const tipo     = DESCRICOES_MBTI[mbti]      || 'Perfil Único'
  const insight  = parcial?.insight_gratuito  || ''
  const pago     = parcial?.relatorio_pago

  return (
    <div className="res-root">
      <div className="res-card">

        {/* Header */}
        <div className="res-header">
          <span className="res-logo">Caminhos</span>
          <span className="res-badge">Módulo 1 — Quem eu sou</span>
        </div>

        {/* Perfil */}
        <div className="res-perfil">
          <div className="res-perfil-glow" />
          <p className="res-perfil-label">Seu perfil</p>
          <h1 className="res-mbti">{mbti}</h1>
          <p className="res-tipo">{tipo}</p>

          <div className="res-tags">
            <span className="res-tag res-tag-disc">DISC: {disc}</span>
            <span className="res-tag res-tag-enea">Eneagrama: {eneagrama}</span>
          </div>
        </div>

        {/* Insight gratuito */}
        <div className="res-insight">
          <p className="res-insight-label">✨ Seu insight inicial</p>
          <p className="res-insight-texto">{insight}</p>
        </div>

        {/* Dimensões */}
        {parcial?.dimensoes?.length > 0 && (
          <div className="res-dimensoes">
            {parcial.dimensoes.map(d => (
              <div key={d.nome} className="res-dimensao">
                <div className="res-dimensao-header">
                  <span>{d.nome}</span>
                  <span>{d.percentual}%</span>
                </div>
                <div className="res-dimensao-bar">
                  <div
                    className="res-dimensao-fill"
                    style={{ width: `${d.percentual}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paywall */}
        {!pago && (
          <div className="res-paywall">
            <div className="res-paywall-blur">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Seu relatório completo inclui análise profunda dos seus padrões comportamentais, pontos cegos e plano de ação de 30 dias...</p>
            </div>
            <div className="res-paywall-cta">
              <p className="res-paywall-titulo">Desbloqueie seu relatório completo</p>
              <p className="res-paywall-sub">11 seções · Plano de ação · PDF para baixar</p>
              <button
                className="res-btn-pagar"
                onClick={iniciarPagamento}
                disabled={pagando}
              >
                {pagando ? 'Aguarde...' : 'Desbloquear por R$29 →'}
              </button>
              <p className="res-paywall-garantia">🔒 Pagamento seguro via Pix · Acesso imediato</p>
            </div>
          </div>
        )}

        {/* Próximo módulo */}
        <div className="res-proximo">
          <p className="res-proximo-label">Próximo passo</p>
          <button
            className="res-btn-skyai"
            onClick={() => navigate('/skyai')}
          >
            ✨ Descobrir meu mapa astral → SkyAI
          </button>
        </div>

        {erro && <p className="res-erro-inline">{erro}</p>}

      </div>
    </div>
  )
}

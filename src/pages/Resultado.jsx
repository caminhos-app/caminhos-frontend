import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import api from '../services/api'
import './Resultado.css'

const DESCRICOES_MBTI = {
  INTJ: 'Estrategista Visionario', INTP: 'Pensador Logico',
  ENTJ: 'Lider Nato',              ENTP: 'Inovador Debatedor',
  INFJ: 'Conselheiro Visionario',  INFP: 'Idealista Mediador',
  ENFJ: 'Protagonista Inspirador', ENFP: 'Ativista Criativo',
  ISTJ: 'Executor Confiavel',      ISFJ: 'Protetor Dedicado',
  ESTJ: 'Administrador Eficiente', ESFJ: 'Cuidador Social',
  ISTP: 'Artesao Pratico',         ISFP: 'Aventureiro Sensivel',
  ESTP: 'Empreendedor Dinamico',   ESFP: 'Animador Espontaneo',
}

export default function Resultado() {
  const { sessao_id } = useParams()
  const navigate      = useNavigate()

  const [parcial,    setParcial]    = useState(null)
  const [completo,   setCompleto]   = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [erro,       setErro]       = useState('')
  const [pagando,    setPagando]    = useState(false)
  const [baixandoPdf, setBaixandoPdf] = useState(false)

  useEffect(() => {
    buscarResultado()
  }, [sessao_id])

  async function buscarResultado() {
    try {
      const { data } = await api.get(`/relatorio/parcial/${sessao_id}`)
      setParcial(data)

      if (data.relatorio_pago) {
        try {
          const resp = await api.get(`/relatorio/completo/${sessao_id}`)
          setCompleto(resp.data)
        } catch (e) {
          console.error('Erro ao carregar relatorio completo:', e)
        }
      }
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

  async function baixarPdf() {
    setBaixandoPdf(true)
    try {
      const resp = await api.get(`/relatorio/completo/${sessao_id}/pdf`, {
        responseType: 'blob',
      })
      const url = window.URL.createObjectURL(new Blob([resp.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      const nome = (parcial?.perfil?.mbti || 'relatorio').toLowerCase()
      link.setAttribute('download', `caminhos-${nome}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert('Erro ao baixar PDF. Tente novamente.')
    } finally {
      setBaixandoPdf(false)
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
  const tipo     = DESCRICOES_MBTI[mbti]      || 'Perfil Unico'
  const insight  = parcial?.insight_gratuito  || ''
  const pago     = parcial?.relatorio_pago

  return (
    <div className="res-root">
      <div className="res-card">

        <div className="res-header">
          <span className="res-logo">Caminhos</span>
          <span className="res-badge">Modulo 1 — Quem eu sou</span>
        </div>

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

        <div className="res-insight">
          <p className="res-insight-label">Seu insight inicial</p>
          <p className="res-insight-texto">{insight}</p>
        </div>

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

        {pago && completo?.relatorio && (
          <div style={{
            marginTop: '2rem',
            padding: '2rem',
            background: 'linear-gradient(to bottom, #faf7ff, #ffffff)',
            borderRadius: 16,
            border: '1px solid #e9e3f5',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}>
              <div style={{
                display: 'inline-block',
                background: 'linear-gradient(90deg, #5b21b6, #d97706)',
                color: 'white',
                padding: '0.35rem 0.85rem',
                borderRadius: 20,
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.5px',
              }}>
                ✨ RELATORIO COMPLETO
              </div>

              <button
                onClick={baixarPdf}
                disabled={baixandoPdf}
                style={{
                  background: baixandoPdf ? '#a78bfa' : '#5b21b6',
                  color: 'white',
                  padding: '0.6rem 1.2rem',
                  border: 'none',
                  borderRadius: 8,
                  cursor: baixandoPdf ? 'wait' : 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'background 0.2s',
                }}
              >
                {baixandoPdf ? 'Gerando PDF...' : '📥 Baixar PDF'}
              </button>
            </div>

            <div style={{
              fontFamily: 'Georgia, serif',
              fontSize: '1rem',
              lineHeight: 1.8,
              color: '#2d2d2d',
            }} className="res-markdown">
              <ReactMarkdown>{completo.relatorio}</ReactMarkdown>
            </div>

            <div style={{
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid #e9e3f5',
              textAlign: 'center',
            }}>
              <button
                onClick={baixarPdf}
                disabled={baixandoPdf}
                style={{
                  background: 'linear-gradient(90deg, #5b21b6, #d97706)',
                  color: 'white',
                  padding: '0.85rem 2rem',
                  border: 'none',
                  borderRadius: 10,
                  cursor: baixandoPdf ? 'wait' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(91, 33, 182, 0.25)',
                }}
              >
                {baixandoPdf ? 'Gerando seu PDF...' : '📥 Baixar relatorio completo em PDF'}
              </button>
              <p style={{fontSize:'0.8rem', color:'#6b7280', marginTop:'0.5rem'}}>
                Guarde seu relatorio para consultar quando quiser
              </p>
            </div>
          </div>
        )}

        {pago && !completo && (
          <div style={{padding:'2rem',textAlign:'center',color:'#666'}}>
            <p>Carregando seu relatorio completo...</p>
          </div>
        )}

        {!pago && (
          <div className="res-paywall">
            <div className="res-paywall-blur">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Seu relatorio completo inclui analise profunda dos seus padroes comportamentais, pontos cegos e plano de acao de 30 dias...</p>
            </div>
            <div className="res-paywall-cta">
              <p className="res-paywall-titulo">Desbloqueie seu relatorio completo</p>
              <p className="res-paywall-sub">11 secoes · Plano de acao · PDF para baixar</p>
              <button
                className="res-btn-pagar"
                onClick={iniciarPagamento}
                disabled={pagando}
              >
                {pagando ? 'Aguarde...' : 'Desbloquear por R$29 →'}
              </button>
              <p className="res-paywall-garantia">Pagamento seguro via Pix · Acesso imediato</p>
            </div>
          </div>
        )}

        <div className="res-proximo">
          <p className="res-proximo-label">Proximo passo</p>
          <button
            className="res-btn-skyai"
            onClick={() => navigate('/skyai')}
          >
            Descobrir meu mapa astral → SkyAI
          </button>
        </div>

        {erro && <p className="res-erro-inline">{erro}</p>}

      </div>
    </div>
  )
}

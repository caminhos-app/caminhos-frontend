import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import api from '../services/api'

export default function Pagamento() {
  const { pagamento_id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const { qr_code, qr_code_base64, valor, produto, referencia_id } = location.state || {}

  const [statusPag, setStatusPag] = useState('aguardando')

  useEffect(() => {
    if (!qr_code) {
      if (referencia_id) {
        navigate(`/resultado/${referencia_id}`, { replace: true })
      } else {
        navigate('/home', { replace: true })
      }
    }
  }, [qr_code, referencia_id, navigate])

  useEffect(() => {
    if (!pagamento_id) return
    const interval = setInterval(async () => {
      try {
        const { data } = await api.get(`/pagamento/status/${pagamento_id}`)
        if (data.aprovado) {
          setStatusPag('aprovado')
          clearInterval(interval)
          setTimeout(() => {
            if (produto === 'relatorio' && referencia_id) {
              navigate(`/resultado/${referencia_id}`)
            } else {
              navigate('/home')
            }
          }, 1500)
        }
      } catch (e) {
        console.error('Polling erro:', e)
      }
    }, 4000)
    return () => clearInterval(interval)
  }, [pagamento_id, produto, referencia_id, navigate])

  const copiarCodigo = () => {
    navigator.clipboard.writeText(qr_code)
    alert('Codigo PIX copiado!')
  }

  if (!qr_code) return (
    <div style={{padding:'2rem',textAlign:'center',fontFamily:'sans-serif'}}>
      <p>Redirecionando...</p>
    </div>
  )

  if (statusPag === 'aprovado') return (
    <div style={{padding:'2rem',textAlign:'center',fontFamily:'sans-serif'}}>
      <h2 style={{color:'#22c55e'}}>Pagamento aprovado!</h2>
      <p>Liberando seu conteudo...</p>
    </div>
  )

  return (
    <div style={{maxWidth:480,margin:'2rem auto',padding:'2rem',fontFamily:'sans-serif',textAlign:'center'}}>
      <h1 style={{color:'#5b21b6',marginBottom:'0.5rem'}}>Pague com PIX</h1>
      <p style={{color:'#666',marginBottom:'1.5rem'}}>
        Valor: <strong>R$ {valor?.toFixed(2).replace('.', ',')}</strong>
      </p>

      {qr_code_base64 && (
        <img
          src={`data:image/png;base64,${qr_code_base64}`}
          alt="QR Code PIX"
          style={{width:240,height:240,margin:'0 auto 1rem',display:'block'}}
        />
      )}

      <p style={{color:'#666',fontSize:'0.9rem',margin:'1rem 0 0.5rem'}}>
        Escaneie com o app do seu banco ou copie o codigo:
      </p>

      <div style={{background:'#f5f5f5',padding:'0.75rem',borderRadius:8,margin:'0.5rem 0',wordBreak:'break-all',maxHeight:100,overflow:'auto'}}>
        <code style={{fontSize:'0.7rem',color:'#333'}}>{qr_code}</code>
      </div>

      <button
        onClick={copiarCodigo}
        style={{background:'#5b21b6',color:'white',padding:'0.75rem 1.5rem',border:'none',borderRadius:8,cursor:'pointer',fontSize:'1rem',margin:'1rem 0'}}
      >
        Copiar codigo PIX
      </button>

      <p style={{color:'#999',fontSize:'0.85rem',marginTop:'1rem'}}>
        Aguardando pagamento... esta tela atualiza sozinha.
      </p>
    </div>
  )
}

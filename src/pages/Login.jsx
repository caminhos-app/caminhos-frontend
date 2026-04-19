import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Pagamento() {
  const { sessao_id } = useParams()
  const navigate = useNavigate()
  const [pix, setPix] = useState(null)
  const [erro, setErro] = useState(null)
  const [statusPag, setStatusPag] = useState('aguardando')

  // Cria o PIX ao abrir a página
  useEffect(() => {
    async function criarPix() {
      try {
        const { data } = await api.post('/pagamento/pix', { sessao_id })
        setPix(data)
      } catch (e) {
        console.error(e)
        setErro('Erro ao gerar PIX. Tente novamente.')
      }
    }
    criarPix()
  }, [sessao_id])

  // Polling para checar se foi pago
  useEffect(() => {
    if (!pix?.payment_id) return
    const interval = setInterval(async () => {
      try {
        const { data } = await api.get(`/pagamento/status/${pix.payment_id}`)
        if (data.status === 'approved') {
          setStatusPag('aprovado')
          clearInterval(interval)
          setTimeout(() => navigate(`/resultado/${sessao_id}?premium=1`), 1500)
        }
      } catch (e) {
        console.error('Polling erro:', e)
      }
    }, 4000)
    return () => clearInterval(interval)
  }, [pix, sessao_id, navigate])

  const copiarCodigo = () => {
    navigator.clipboard.writeText(pix.qr_code)
    alert('Código PIX copiado!')
  }

  if (erro) return (
    <div style={styles.container}>
      <p style={{color:'#c00'}}>{erro}</p>
      <button onClick={() => navigate(-1)} style={styles.botao}>Voltar</button>
    </div>
  )

  if (!pix) return (
    <div style={styles.container}>
      <p>Gerando seu PIX...</p>
    </div>
  )

  if (statusPag === 'aprovado') return (
    <div style={styles.container}>
      <h2 style={{color:'#22c55e'}}>✓ Pagamento aprovado!</h2>
      <p>Liberando seu relatório completo...</p>
    </div>
  )

  return (
    <div style={styles.container}>
      <h1 style={styles.titulo}>Pague com PIX</h1>
      <p style={styles.sub}>Valor: <strong>R$ 29,00</strong></p>

      {pix.qr_code_base64 && (
        <img
          src={`data:image/png;base64,${pix.qr_code_base64}`}
          alt="QR Code PIX"
          style={styles.qr}
        />
      )}

      <p style={styles.instrucao}>Escaneie com o app do seu banco ou copie o código:</p>

      <div style={styles.codigoBox}>
        <code style={styles.codigo}>{pix.qr_code}</code>
      </div>

      <button onClick={copiarCodigo} style={styles.botao}>
        📋 Copiar código PIX
      </button>

      <p style={styles.aguardando}>
        Aguardando pagamento... esta tela atualiza sozinha.
      </p>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: 480,
    margin: '2rem auto',
    padding: '2rem',
    fontFamily: 'sans-serif',
    textAlign: 'center'
  },
  titulo: { color: '#5b21b6', marginBottom: '0.5rem' },
  sub: { color: '#666', marginBottom: '1.5rem' },
  qr: { width: 240, height: 240, margin: '0 auto 1rem' },
  instrucao: { color: '#666', fontSize: '0.9rem', margin: '1rem 0 0.5rem' },
  codigoBox: {
    background: '#f5f5f5',
    padding: '0.75rem',
    borderRadius: 8,
    margin: '0.5rem 0',
    wordBreak: 'break-all',
    maxHeight: 100,
    overflow: 'auto'
  },
  codigo: { fontSize: '0.7rem', color: '#333' },
  botao: {
    background: '#5b21b6',
    color: 'white',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: '1rem',
    margin: '1rem 0'
  },
  aguardando: { color: '#999', fontSize: '0.85rem', marginTop: '1rem' }
}

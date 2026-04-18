import { useNavigate } from 'react-router-dom'
import './LandingPage.css'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="lp-root">

      {/* NAV */}
      <nav className="lp-nav">
        <div className="lp-container">
          <span className="lp-logo">Caminhos</span>
          <button className="lp-nav-btn" onClick={() => navigate('/login')}>
            Entrar
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="lp-hero">
        <div className="lp-hero-glow" />
        <div className="lp-container">
          <span className="lp-badge">Autoconhecimento · Saúde Espiritual · Prosperidade</span>
          <h1 className="lp-h1">
            Você já caminhou muito.<br />
            <span className="lp-h1-accent">Agora descubra o que ninguém nunca te contou sobre você.</span>
          </h1>
          <p className="lp-sub">
            Descubra quem você é, cuide da sua saúde espiritual e encontre seu caminho para prosperar — de dentro para fora.
          </p>
          <button className="lp-cta" onClick={() => navigate('/cadastro')}>
            Começar minha jornada →
          </button>
          <p className="lp-free">Gratuito para começar · Sem cartão de crédito</p>
        </div>
      </section>

      {/* MÓDULOS */}
      <section className="lp-section">
        <div className="lp-container">
          <p className="lp-section-label">O ecossistema</p>
          <div className="lp-modules">
            <div className="lp-module-card">
              <div className="lp-module-icon lp-icon-teal">🧠</div>
              <h3 className="lp-module-title">Quem eu sou</h3>
              <p className="lp-module-desc">MBTI + DISC + Eneagrama em ~40 perguntas adaptativas</p>
              <span className="lp-module-tag">YouDecodedAI</span>
            </div>
            <div className="lp-module-card">
              <div className="lp-module-icon lp-icon-purple">✨</div>
              <h3 className="lp-module-title">O universo e eu</h3>
              <p className="lp-module-desc">Mapa astral + numerologia personalizados pela IA</p>
              <span className="lp-module-tag">SkyAI</span>
            </div>
            <div className="lp-module-card">
              <div className="lp-module-icon lp-icon-amber">🙏</div>
              <h3 className="lp-module-title">Minha Transformação</h3>
              <p className="lp-module-desc">Materialização da transformação — entregue na sua casa</p>
              <span className="lp-module-tag">Manifesto</span>
            </div>
          </div>
        </div>
      </section>

      {/* JORNADA */}
      <section className="lp-section">
        <div className="lp-container">
          <p className="lp-section-label">Sua jornada</p>
          <div className="lp-journey">
            {[
              { n: '1', title: 'Cadastre-se gratuitamente', desc: 'Nome e e-mail. Sem cartão. Em 30 segundos.' },
              { n: '2', title: 'Faça o teste de autoconhecimento', desc: '~40 perguntas adaptativas. Resultado parcial gratuito.' },
              { n: '3', title: 'Aprofunde com astrologia', desc: 'Seu mapa astral + numerologia completos.' },
              { n: '4', title: 'Ancore sua transformação', desc: 'Receba seu objeto de intenção com sua missão.' },
            ].map((s) => (
              <div className="lp-step" key={s.n}>
                <div className="lp-step-num">{s.n}</div>
                <div>
                  <p className="lp-step-title">{s.title}</p>
                  <p className="lp-step-desc">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NÚMEROS */}
      <section className="lp-section">
        <div className="lp-container">
          <p className="lp-section-label">Números</p>
          <div className="lp-proof">
            <div className="lp-proof-card">
              <span className="lp-proof-num">3</span>
              <span className="lp-proof-label">metodologias integradas</span>
            </div>
            <div className="lp-proof-card">
              <span className="lp-proof-num">40+</span>
              <span className="lp-proof-label">perguntas adaptativas</span>
            </div>
            <div className="lp-proof-card">
              <span className="lp-proof-num">100%</span>
              <span className="lp-proof-label">personalizado por IA</span>
            </div>
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="lp-section">
        <div className="lp-container">

          {/* Barra de avaliação */}
          <div className="lp-rating-bar">
            <div className="lp-stars">★★★★★</div>
            <span className="lp-rating-text">4.9 de 5 · mais de 200 avaliações</span>
          </div>

          <p className="lp-section-label" style={{ marginTop: '1.5rem' }}>O que as pessoas dizem</p>

          <div className="lp-depos">

            {/* Linha 1 */}
            <div className="lp-depo">
              <div className="lp-depo-stars">★★★★★</div>
              <p className="lp-depo-text">"Nunca entendi tão bem por que repito os mesmos padrões. O relatório foi como um espelho que eu nunca tive."</p>
              <div className="lp-depo-footer">
                <p className="lp-depo-author">Mariana S., 38 anos · São Paulo</p>
                <span className="lp-depo-tag">YouDecodedAI</span>
              </div>
            </div>

            <div className="lp-depo">
              <div className="lp-depo-stars">★★★★★</div>
              <p className="lp-depo-text">"O Manifesto chegou e eu chorei. Parecia que alguém finalmente me viu de verdade. É lindo e carregado de significado."</p>
              <div className="lp-depo-footer">
                <p className="lp-depo-author">Fernanda R., 44 anos · Belo Horizonte</p>
                <span className="lp-depo-tag">Manifesto</span>
              </div>
            </div>

            {/* Linha 2 */}
            <div className="lp-depo">
              <div className="lp-depo-stars">★★★★★</div>
              <p className="lp-depo-text">"O mapa astral cruzado com meu perfil comportamental foi revelador. Nunca vi nada assim. Fez total sentido com a minha vida."</p>
              <div className="lp-depo-footer">
                <p className="lp-depo-author">Camila T., 35 anos · Curitiba</p>
                <span className="lp-depo-tag">SkyAI</span>
              </div>
            </div>

            <div className="lp-depo">
              <div className="lp-depo-stars">★★★★★</div>
              <p className="lp-depo-text">"Fiz o teste em 20 minutos e o relatório me descreveu de um jeito que meus amigos de 10 anos não conseguiriam. Impressionante."</p>
              <div className="lp-depo-footer">
                <p className="lp-depo-author">Juliana M., 42 anos · Rio de Janeiro</p>
                <span className="lp-depo-tag">YouDecodedAI</span>
              </div>
            </div>

            {/* Linha 3 */}
            <div className="lp-depo">
              <div className="lp-depo-stars">★★★★★</div>
              <p className="lp-depo-text">"Estava em um momento de transição na vida e a Caminhos me ajudou a entender meus padrões e tomar decisões com mais clareza."</p>
              <div className="lp-depo-footer">
                <p className="lp-depo-author">Patrícia L., 51 anos · Porto Alegre</p>
                <span className="lp-depo-tag">YouDecodedAI</span>
              </div>
            </div>

            <div className="lp-depo">
              <div className="lp-depo-stars">★★★★★</div>
              <p className="lp-depo-text">"O objeto que recebi é simplesmente único. Tenho na minha mesa de trabalho todos os dias. Me lembra quem eu estou me tornando."</p>
              <div className="lp-depo-footer">
                <p className="lp-depo-author">Roberta A., 39 anos · Brasília</p>
                <span className="lp-depo-tag">Manifesto</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PLANOS */}
      <section className="lp-section">
        <div className="lp-container">
          <p className="lp-section-label">Planos</p>
          <div className="lp-plans">
            <div className="lp-plan">
              <span className="lp-plan-price">Grátis</span>
              <p className="lp-plan-name">Explorar</p>
              <p className="lp-plan-feat">Teste completo · Perfil resumido</p>
            </div>
            <div className="lp-plan lp-plan-featured">
              <span className="lp-plan-badge">Mais popular</span>
              <span className="lp-plan-price">R$29</span>
              <p className="lp-plan-name">Conhecer</p>
              <p className="lp-plan-feat">Relatório completo · PDF · Plano 30 dias</p>
            </div>
            <div className="lp-plan">
              <span className="lp-plan-price">R$197</span>
              <p className="lp-plan-name">Transformar</p>
              <p className="lp-plan-feat">Tudo + Manifesto físico personalizado</p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="lp-final">
        <div className="lp-final-glow" />
        <div className="lp-container">
          <h2 className="lp-final-title">Pronta para se conhecer de verdade?</h2>
          <p className="lp-final-sub">Sua jornada começa com uma pergunta simples.</p>
          <button className="lp-cta" onClick={() => navigate('/cadastro')}>
            Começar agora — é gratuito →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-container">
          <p>© 2026 Caminhos · meuscaminhos.app</p>
          <p>contato@meuscaminhos.app</p>
        </div>
      </footer>

    </div>
  )
}

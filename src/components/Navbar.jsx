import { Link, useLocation } from 'react-router-dom'
import '../styles/Header.css'

function Navbar() {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path ? 'active' : ''
  }

  return (
    <div className="navbar-wrapper">
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light">
          <Link to="/" className="navbar-brand">
            <img src="/img/black-logo.png" height="70" alt="HSFA Saúde" className="navbar-logo" />
          </Link>
          <button 
            type="button" 
            className="navbar-toggler" 
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
            aria-controls="navbarCollapse"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <div className="navbar-nav ms-auto">
              <Link to="/" className={`nav-link ${isActive('/')}`}>
                Início
              </Link>
              <Link to="/quem-somos" className={`nav-link ${isActive('/quem-somos')}`}>
                O HSFA
              </Link>
              <Link to="/editais" className={`nav-link ${isActive('/editais')}`}>
                Editais
              </Link>
              <Link to="/exames" className={`nav-link ${isActive('/exames')}`}>
                Exames
              </Link>
              <Link to="/cirurgias" className={`nav-link ${isActive('/cirurgias')}`}>
                Cirurgias
              </Link>
              <a 
                href="https://pacs.hsfasaude.com.br/login" 
                target="_blank" 
                rel="noopener noreferrer"
                className="nav-link"
                title="Resultados Online"
              >
                Resultados
              </a>
              <Link to="/contato" className={`nav-link ${isActive('/contato')}`}>
                S.A.C
              </Link>
              <Link to="/pesquisa-satisfacao" className={`nav-link ${isActive('/pesquisa-satisfacao')}`} title="Pesquisa de Satisfação">
                Pesquisa
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}

export default Navbar

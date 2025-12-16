import { useState } from 'react'
import { contatoService } from '../services/api'

function Contato() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: '',
    celular: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      // Em produção, descomente a linha abaixo
      // await contatoService.send(formData)
      
      // Simulação de envio
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMessage({ 
        type: 'success', 
        text: 'Mensagem enviada com sucesso! Entraremos em contato em breve.' 
      })
      setFormData({
        nome: '',
        email: '',
        assunto: '',
        celular: '',
        message: ''
      })
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Erro ao enviar mensagem. Por favor, tente novamente ou envie um e-mail para sac@hsfasaude.com.br' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Page Header Start */}
      <div className="container-fluid page-header py-5 mb-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container text-center py-5">
          <h1 className="display-2 text-white mb-4 animated slideInDown">Fale Conosco</h1>
        </div>
      </div>
      {/* Page Header End */}

      {/* Contact Form Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
              <h1 className="display-5 mb-4">Faça seu Relato</h1>
              <p>
                Este é um canal exclusivo do Hospital São Francisco de Assis para você realizar o seu relato sobre nossos serviços,
                elogios, sugestões ou reclamações. A veracidade das informações providas é uma responsabilidade do relator.
              </p>
              <p>Se preferir, envie um e-mail para <strong>sac@hsfasaude.com.br.</strong></p>
              <a 
                style={{ marginTop: '25px' }} 
                className="d-inline-flex align-items-center rounded overflow-hidden border border-primary" 
                href="tel:+556232218000"
              >
                <span className="btn-lg-square bg-primary" style={{ width: '55px', height: '55px' }}></span>
                <span className="fs-5 fw-medium mx-4">+55 (62) 3221-8000</span>
              </a>
            </div>
            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.5s">
              <form onSubmit={handleSubmit}>
                <h2 className="mb-4">Envie Sua Mensagem</h2>
                
                {message.text && (
                  <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'}`} role="alert">
                    {message.text}
                  </div>
                )}

                <div className="row g-3">
                  <div className="col-sm-6">
                    <div className="form-floating">
                      <input 
                        type="text" 
                        className="form-control" 
                        name="nome" 
                        id="name" 
                        placeholder="Seu Nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="name">Seu Nome</label>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-floating">
                      <input 
                        type="email" 
                        className="form-control" 
                        name="email" 
                        id="mail" 
                        placeholder="Seu E-mail"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="mail">Seu E-mail</label>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-floating">
                      <input 
                        type="text" 
                        className="form-control" 
                        name="assunto" 
                        placeholder="Assunto"
                        value={formData.assunto}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="assunto">Assunto</label>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-floating">
                      <input 
                        type="text" 
                        className="form-control" 
                        name="celular" 
                        id="mobile" 
                        placeholder="Seu Número de Celular"
                        value={formData.celular}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="mobile">Seu Número de Celular</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-floating">
                      <textarea 
                        className="form-control" 
                        placeholder="Deixe sua mensagem aqui" 
                        name="message" 
                        id="message"
                        style={{ height: '130px' }}
                        value={formData.message}
                        onChange={handleChange}
                        required
                      ></textarea>
                      <label htmlFor="message">Mensagem</label>
                    </div>
                  </div>
                  <div className="col-12 text-center">
                    <button 
                      className="btn btn-primary w-100 py-3" 
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? 'Enviando...' : 'Enviar'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Contact Form End */}
    </>
  )
}

export default Contato


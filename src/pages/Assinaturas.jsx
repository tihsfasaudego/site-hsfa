import { useEffect, useState } from 'react'
import '../styles/Assinaturas.css'

function Assinaturas() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Esconder spinner após carregamento
    const spinner = document.getElementById('spinner')
    if (spinner) {
      setTimeout(() => {
        spinner.classList.remove('show')
      }, 500)
    }

    // Carregar conteúdo do carimbo.html
    const loadContent = async () => {
      try {
        const response = await fetch('/assinaturas/api/conteudo')
        
        // Verificar se a resposta HTTP foi bem-sucedida
        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Erro desconhecido')
          console.error(`Erro HTTP ${response.status}:`, errorText.substring(0, 200))
          throw new Error(`Erro ao carregar conteúdo: ${response.status} ${response.statusText}`)
        }
        
        // Verificar se a resposta é JSON
        const contentType = response.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text()
          console.error('Resposta não é JSON:', text.substring(0, 200))
          throw new Error('A API retornou HTML ao invés de JSON. Verifique se o servidor está rodando na porta 3000.')
        }
        
        const data = await response.json()
        
        if (data.success) {
          setContent(data.html)
          setLoading(false) // Atualizar loading imediatamente após receber o conteúdo
          
          // Executar scripts após um pequeno delay para garantir que o DOM está pronto
          setTimeout(() => {
            if (data.scripts && data.scripts.length > 0) {
              data.scripts.forEach(scriptTag => {
                // Extrair apenas o conteúdo do script (sem as tags)
                let scriptContent = scriptTag.replace(/<script[^>]*>([\s\S]*?)<\/script>/i, '$1')
                
                // Substituir referências antigas à API PHP pela nova API Node.js
                scriptContent = scriptContent.replace(
                  /fetch\(['"]salvar_assinatura\.php['"]/g,
                  "fetch('/assinaturas/api/salvar'"
                )
                scriptContent = scriptContent.replace(
                  /fetch\(['"]\/assinaturas\/salvar_assinatura\.php['"]/g,
                  "fetch('/assinaturas/api/salvar'"
                )
                
                // Substituir FormData por JSON - versão mais robusta
                // Substituir criação do FormData
                scriptContent = scriptContent.replace(
                  /const formData = new FormData\(\);\s*formData\.append\(['"]nome['"], nome\);\s*formData\.append\(['"]cargo['"], cargo\);\s*formData\.append\(['"]empresa['"], empresa\);\s*formData\.append\(['"]registro['"], registro\);\s*formData\.append\(['"]imagem['"], imagemBase64\);/g,
                  `const dados = {
                nome: nome,
                cargo: cargo || '',
                empresa: empresa || '',
                registro: registro || '',
                imagem: imagemBase64
            };`
                )
                
                // Substituir body: formData (versão mais flexível)
                scriptContent = scriptContent.replace(
                  /body:\s*formData/g,
                  `body: JSON.stringify(dados),
                    headers: {
                        'Content-Type': 'application/json'
                    }`
                )
                
                // Adicionar verificação de resposta HTTP antes de fazer parse JSON
                scriptContent = scriptContent.replace(
                  /const resultado = await response\.json\(\);/g,
                  `if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: 'Erro ao processar resposta do servidor' }));
                    throw new Error(errorData.message || \`Erro HTTP: \${response.status}\`);
                }
                
                const resultado = await response.json();`
                )
                
                if (scriptContent.trim()) {
                  try {
                    // Criar e executar o script dentro do container do conteúdo
                    const container = document.querySelector('#carimbo-content')
                    const script = document.createElement('script')
                    script.textContent = scriptContent
                    if (container) {
                      container.appendChild(script)
                      container.removeChild(script)
                    } else {
                      document.body.appendChild(script)
                      document.body.removeChild(script)
                    }
                  } catch (error) {
                    console.error('Erro ao executar script:', error)
                  }
                }
              })
            }
          }, 300)
        } else {
          setLoading(false)
          console.error('API retornou sucesso=false:', data.message)
        }
      } catch (error) {
        console.error('Erro ao carregar conteúdo:', error)
        setLoading(false)
      }
    }

    loadContent()
  }, [])

  return (
    <>
      {/* Sistema Container Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="sistema-container" 
            style={{
              background: 'white',
              borderRadius: '15px',
              boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
              padding: 0,
              margin: 0,
              width: '100%',
              overflowX: 'hidden',
              overflowY: 'auto'
            }}
          >
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Carregando...</span>
                </div>
              </div>
            ) : (
              <div 
                id="carimbo-content"
                className="carimbo-wrapper"
                dangerouslySetInnerHTML={{ __html: content }}
                style={{
                  width: '100%',
                  padding: '20px',
                  background: 'white'
                }}
              />
            )}
          </div>
        </div>
      </div>
      {/* Sistema Container End */}
    </>
  )
}

export default Assinaturas


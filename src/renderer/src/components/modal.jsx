import { useState } from 'react'
import './modal.css'
import logo from '../assets/logo.png'

function Modal({ funcao1,funcao2 }) {
  const [status, setStatus] = useState('')
  const [options, setOptions] = useState(false)
  const [credencial, setCredencial] = useState({
    host: '',
    user: '',
    password: '',
    port: '',
    database: ''
  })

  function conectarBD() {
    window.electron.ipcRenderer.invoke('conexao-db', credencial)
      .then(result => {
        console.log('Resultado da query:', result)
        if (result.success) {
          setStatus('Conexão bem-sucedida!')
          setOptions(false)
          funcao1()
          funcao2()
        } else {
          setStatus(`Erro: ${result.error}`)
        }
      })
      .catch(err => {
        console.error('Erro ao executar query:', err)
        setStatus('Erro ao conectar com o banco de dados.')
      })
  }

  return (
    <>
      <div id='abc'>
        <img id='img' src={logo} onClick={() => setOptions(true)} alt="Logo" />
        <div>
          {options && (
            <div className="modal-overlay">
              <div className="modal-content">
                <button className="close-button" onClick={() => setOptions(false)}>
                  &times;
                </button>
                <h2>Configurações</h2>
                <p>Host</p>
                <input
                  type="text"
                  value={credencial.host}
                  onChange={(e) => setCredencial({ ...credencial, host: e.target.value })}
                />
                <p>User</p>
                <input
                  type="text"
                  value={credencial.user}
                  onChange={(e) => setCredencial({ ...credencial, user: e.target.value })}
                />
                <p>Password</p>
                <input
                  type="password"
                  value={credencial.password}
                  onChange={(e) => setCredencial({ ...credencial, password: e.target.value })}
                />
                <p>Port</p>
                <input
                  type="text"
                  value={credencial.port}
                  onChange={(e) => setCredencial({ ...credencial, port: e.target.value })}
                />
                <p>Database</p>
                <input
                  type="text"
                  value={credencial.database}
                  onChange={(e) => setCredencial({ ...credencial, database: e.target.value })}
                />
                <button id='btn' onClick={conectarBD}>SALVAR</button>
                <p style={{ color: 'green', fontWeight: 'bold' }}>{status}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Modal

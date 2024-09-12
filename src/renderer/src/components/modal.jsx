import { useState } from 'react'
import './modal.css'
import logo from '../assets/logo.png'

function Modal() {
  const [status, setStatus] = useState('')
  const [options, setOptions] = useState(false)
  const [produto, setProduto] = useState([])
  const [resposta, setResposta] = useState([])
  const [credencial, setCredencial] = useState({
    host: '',
    user: '',
    password: '',
    port: '',
    database: ''
  })

  function queryProduto() {
    window.electron.ipcRenderer.invoke('execute-query', 'SELECT * FROM produto').then(result => {
      console.log('Resultado da query:', result)
      setProduto(String(result))
    }).catch(err => {
      console.error('Erro ao executar query:', err)
    })
  }
  function conectarBD() {
    window.electron.ipcRenderer.invoke('conexao-db', credencial).then(result => {
      console.log('Resultado da query:', result)
      if (result.success) {
        setStatus('Conexão bem-sucedida!');
      } else {
        setStatus(`Erro: ${result.error}`);
      }
    }).catch(err => {
      console.error('Erro ao executar query:', err)
    })
  }
  function queryText() {
    window.electron.ipcRenderer.invoke('so-query', query).then(result => {
      console.log('Resultado da query:', result)
      setResposta(result)
    }).catch(err => {
      console.error('Erro ao executar query:', err)
    })
  }

  //{resposta.length > 0 && <p>{resposta[count].nome}</p>}
  return (
    <>

      <div>
        <img src={logo} onClick={() => setOptions(true)} alt="Logo" style={{ cursor:'pointer', width: '30px',  backgroundColor: 'white', padding: 3, borderRadius: 5, margin: 10 }} />

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
              <button onClick={conectarBD}>SALVAR</button>
              <p style={{color:'green',fontWeight:'bold'}}>{status}</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Modal


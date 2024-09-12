import { useState } from 'react'
import './modal.css'
import logo from '../assets/logo.png'

function Cadastro() {
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
            <div id='main' >

                <div id='list' >

                    <div style={{width:'15%'}} >
                        <p>Codigo de Barras:</p>
                        <input ></input>
                    </div>
                    <div style={{width:'30%'}}>
                        <p >Descrição:</p>
                        <input  ></input>
                    </div>
                    <div>
                        <p>NCM:</p>
                        <input type='number' ></input>
                    </div>
                    <div style={{width:'10%'}}>
                        <p >Preço:</p>
                        <input type='number' ></input>
                    </div>
                    <div style={{display:'flex',justifyContent:"center",paddingTop:6,width:'5%'}}>

                    <button id='btn' >Salvar</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Cadastro


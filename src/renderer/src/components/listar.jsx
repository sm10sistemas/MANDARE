import { useState } from "react"

function ListarProdutos() {
    const [produto, setProduto] = useState([])

    function queryProduto() {
        window.electron.ipcRenderer.invoke('execute-query', 'SELECT * FROM produto').then(result => {
            console.log('Resultado da query:', result)
            setProduto(String(result))
        }).catch(err => {
            console.error('Erro ao executar query:', err)
        })
    }
    return (
        <>
            <div>
                <button onClick={queryProduto}>ver produtos</button>
            </div>
        </>
    )
}

export default ListarProdutos


import { useState } from "react"

function ListarProdutos() {
    const [produto, setProduto] = useState([])

    function queryProduto() {
        window.electron.ipcRenderer.invoke('execute-query', 'SELECT * FROM produtos').then(result => {
            console.log('Resultado da query:', result)
            setProduto(result)
        }).catch(err => {
            console.error('Erro ao executar query:', err)
        })
    }
    

    return (
        <>
            <div>
                <button onClick={queryProduto}>ver produtos</button>
                {produto.length > 0 ? <div>
                    {produto.map((i) => (<div style={{ display: 'flex' }}>
                        <p >{i.codigo}</p>
                        <p style={{ marginLeft: 30 }}>{i.nome}</p>
                        <p style={{ marginLeft: 30 }}>{i.ean}</p>
                        <p style={{ marginLeft: 30 }}>{i.preco}</p>
                    </div>))}
                </div> : ''}
            </div>
        </>
    )
}

export default ListarProdutos


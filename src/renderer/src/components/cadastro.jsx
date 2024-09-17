import { useState, useEffect, useCallback } from 'react';
import Modal from './modal';
import './modal.css';
import loadingGif from './rick.gif'; // Caminho para o GIF de carregamento
import edit from '../assets/lapis.png';

function Cadastro() {
    const [conectado, setConectado] = useState(false);
    const [loading, setLoading] = useState(false);
    const [listaProduto, setListaProduto] = useState([]);
    const [produtoEditado, setProdutoEditado] = useState(null); // Estado para armazenar o produto que está sendo editado

    const carregarProdutos = useCallback(() => {
        setLoading(true);

        window.electron.ipcRenderer.invoke('execute-query', 'SELECT * FROM produto LIMIT 50')
            .then((result) => {
                setListaProduto(result);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Erro ao carregar produtos:', err);
                setLoading(false);
            });
    }, []);
    const salvarEdicao = useCallback(() => {
        const updateQuery = `
        UPDATE produto
        SET nome = '${produtoEditado.nome}', ean = '${produtoEditado.ean}', ncm = '${produtoEditado.ncm}', preco = '${produtoEditado.preco}'
        WHERE codigo = '${produtoEditado.codigo}';
    `;
    
        window.electron.ipcRenderer.invoke('execute-query', updateQuery)
            .then((result) => {
                   setProdutoEditado(null) 
                   console.log(result)
            })
            .catch((err) => {
                console.error('Erro ao carregar produtos:', err);
            });
    }, []);

    const verificarConexao = async () => {
        try {
            const result = await window.electron.ipcRenderer.invoke('conectado');
            setConectado(result);
        } catch (error) {
            console.error('Erro ao verificar conexão:', error);
        }
    };
    

    const editarProduto = (produto) => {
        setProdutoEditado(produto);
    };



    return (
        <>
            {loading && (
                <div className="loading-overlay">
                    <img src={loadingGif} alt="Loading..." className="loading-gif" />
                </div>
            )}

            <Modal funcao1={verificarConexao} funcao2={carregarProdutos} />

            {conectado && (
                <div className="container_inputs">
                    <div id="entrada">
                        <p>Código de barras</p>
                        <input type="text" onChange={(e) => setProdutoEditado({ ...produtoEditado, ean: e.target.value })} />
                    </div>
                    <div id="entrada">
                        <p>Nome</p>
                        <input type="text" onChange={(e) => setProdutoEditado({ ...produtoEditado, nome: e.target.value })} />
                    </div>
                    <div id="entrada">
                        <p>NCM</p>
                        <input type="text" onChange={(e) => setProdutoEditado({ ...produtoEditado, ncm: e.target.value })} />
                    </div>
                    <div id="entrada">
                        <p>Preço</p>
                        <input type="text" onChange={(e) => setProdutoEditado({ ...produtoEditado, preco: e.target.value })} />
                    </div>
                </div>
            )}

            {listaProduto.length > 0 && (
                <div className="containerLista">
                    <div className="planilha">
                        <div className="planilha-header">
                            <p>Código</p>
                            <p>Nome</p>
                            <p>EAN</p>
                            <p>NCM</p>
                            <p>Preço</p>
                            <p>Edit</p>
                        </div>
                        <div className="listaProdutos">
                            {listaProduto.map((produto) => (
                                <div className="planilha-row" key={produto.codigo}>
                                    {produtoEditado && produtoEditado.codigo === produto.codigo ? (
                                        <>
                                            <input
                                                type="text"
                                                name="codigo"
                                                value={produtoEditado.codigo}
                                                onChange={(e) => setProdutoEditado({ ...produtoEditado, codigo: e.target.value })}
                                                disabled
                                            />
                                            <input
                                                type="text"
                                                name="nome"
                                                value={produtoEditado.nome}
                                                onChange={(e) => setProdutoEditado({ ...produtoEditado, nome: e.target.value })}
                                            />
                                            <input
                                                type="text"
                                                name="ean"
                                                value={produtoEditado.ean}
                                                onChange={(e) => setProdutoEditado({ ...produtoEditado, ean: e.target.value })}
                                            />
                                            <input
                                                type="text"
                                                name="ncm"
                                                value={produtoEditado.ncm}
                                                onChange={(e) => setProdutoEditado({ ...produtoEditado, ncm: e.target.value })}
                                            />
                                            <input
                                                type="text"
                                                name="preco"
                                                value={produtoEditado.preco}
                                                onChange={(e) => setProdutoEditado({ ...produtoEditado, preco: e.target.value })}
                                            />
                                            <button onClick={salvarEdicao}>Salvar</button>
                                        </>
                                    ) : (
                                        <>
                                            <p>{produto.codigo}</p>
                                            <p>{produto.nome}</p>
                                            <p>{produto.ean}</p>
                                            <p>{produto.ncm}</p>
                                            <p>{produto.preco}</p>
                                            <img
                                                id="img2"
                                                src={edit}
                                                onClick={() => editarProduto(produto)}
                                                alt="Editar Produto"
                                            />
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Cadastro;

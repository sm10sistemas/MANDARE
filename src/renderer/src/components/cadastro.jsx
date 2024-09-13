import { useState, useEffect, useRef, useCallback } from 'react';
import './modal.css';
import logo from '../assets/logo.png';

function Cadastro() {
    const [produtos, setProdutos] = useState([]);
    const [novoProduto, setNovoProduto] = useState(inicializarProduto());
    const [editandoProduto, setEditandoProduto] = useState(null);
    const eanInputRef = useRef(null);

    // Inicializa um novo produto vazio
    function inicializarProduto() {
        return {
            nome: '',
            ean: '',
            ncm: '',
            preco: '',
        };
    }

    // Carrega os produtos na montagem do componente
    useEffect(() => {
        carregarProdutos();
    }, []);

    // Função para carregar os produtos do banco de dados
    const carregarProdutos = useCallback(() => {
        window.electron.ipcRenderer.invoke('execute-query', 'SELECT * FROM produtos ORDER BY data_criacao DESC')
            .then(setProdutos)
            .catch((err) => console.error('Erro ao carregar produtos:', err));
    }, []);

    // Função para gravar ou atualizar o produto
    const salvarProduto = useCallback(async () => {
        if (editandoProduto) {
            await atualizarProduto(novoProduto);
        } else {
            await inserirProduto(novoProduto);
        }
        setNovoProduto(inicializarProduto());
        setEditandoProduto(null);
        carregarProdutos();
    }, [novoProduto, editandoProduto, carregarProdutos]);

    // Função para inserir um novo produto no banco de dados
    async function inserirProduto(produtoObj) {
        const query = `
            INSERT INTO produtos (nome, ean, preco, ncm)
            VALUES ('${produtoObj.nome}', '${produtoObj.ean}', ${produtoObj.preco}, '${produtoObj.ncm}')
            RETURNING *;
        `;
        try {
            const result = await window.electron.ipcRenderer.invoke('execute-query', query);
            console.log('Produto inserido com sucesso:', result);
        } catch (err) {
            console.error('Erro ao inserir produto:', err);
        }
    }

    // Função para atualizar um produto existente no banco de dados
    async function atualizarProduto(produtoObj) {
        const query = `
            UPDATE produtos 
            SET nome='${produtoObj.nome}', ean='${produtoObj.ean}', preco=${produtoObj.preco}, ncm='${produtoObj.ncm}' 
            WHERE codigo=${produtoObj.codigo};
        `;
        try {
            const result = await window.electron.ipcRenderer.invoke('execute-query', query);
            console.log('Produto atualizado com sucesso:', result);
        } catch (err) {
            console.error('Erro ao atualizar produto:', err);
        }
    }

    // Função para configurar o produto a ser editado
    function iniciarEdicao(produto) {
        setNovoProduto(produto);
        setEditandoProduto(produto.codigo);
    }

    // Efeito para focar o campo EAN quando um produto está sendo editado
    useEffect(() => {
        if (editandoProduto !== null && eanInputRef.current) {
            eanInputRef.current.focus();
        }
    }, [editandoProduto]);

    // Função para manipular as mudanças nos campos do formulário
    function handleInputChange(event) {
        const { name, value } = event.target;
        setNovoProduto((prevState) => ({ ...prevState, [name]: value }));
    }

    return (
        <>
            <div id="main">
                <div id="list">
                    <Input label="Código de Barras" name="ean" value={novoProduto.ean} onChange={handleInputChange} ref={eanInputRef} />
                    <Input label="Descrição" name="nome" value={novoProduto.nome} onChange={handleInputChange} />
                    <Input label="NCM" name="ncm" value={novoProduto.ncm} onChange={handleInputChange} type="number" />
                    <Input label="Preço" name="preco" value={novoProduto.preco} onChange={handleInputChange} type="number" />
                    <div style={{ display: 'flex', justifyContent: "center", paddingTop: 6, width: '5%' }}>
                        <button id="btn" onClick={salvarProduto}>{editandoProduto ? 'Atualizar' : 'Salvar'}</button>
                    </div>
                </div>
            </div>

            {produtos.length > 0 && (
                
                <div  id='produtos' >
                    <div style={{marginBottom:10,borderRadius:2}} id="header">
                        <span id="header-codigo">Código</span>
                        <span id="header-nome">Nome</span>
                        <span id="header-ean">EAN</span>
                        <span id="header-preco">Preço</span>
                        <span id="header-edit">Alterar</span>
                    </div>
                    
                    {produtos.map((produto, index) => (
                        <div key={produto.codigo} className={`row ${index % 2 === 0 ? 'even' : 'odd'}`}>
                            <span id={`codigo-${produto.codigo}`}>{produto.codigo}</span>
                            <span id={`nome-${produto.codigo}`} className="nome">{produto.nome}</span>
                            <span id={`ean-${produto.codigo}`} className="ean">{produto.ean}</span>
                            <span id={`preco-${produto.codigo}`} className="preco">{produto.preco}</span>
                            <button id="btn-edit" onClick={() => iniciarEdicao(produto)}>Alterar</button>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

// Componente reutilizável para entrada de dados
const Input = ({ label, name, value, onChange, type = "text", ref }) => (
    <div style={{ width: type === 'number' ? '10%' : '30%' }}>
        <p>{label}:</p>
        <input
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            ref={ref}
        />
    </div>
);

export default Cadastro;

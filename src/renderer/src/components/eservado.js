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

import Cadastro from "./components/Cadastro"
import Modal from "./components/modal"
import ListarProdutos from "./components/listar"
function App() {

  return (
    <>
    <div style={{display:'flex',justifyContent:'center', flexDirection:'column',alignItems:'center'}}>
        <Modal></Modal>
        <Cadastro></Cadastro>
        <ListarProdutos></ListarProdutos>
      </div>
    </>
  )
}

export default App



import Modal from "./components/modal"
import Cadastro from "./components/cadastro"
function App() {

  return (
    <>
    <div style={{display:'flex',justifyContent:'start', flexDirection:'column',alignItems:'center'}}>
        <Modal></Modal>
        <Cadastro></Cadastro>
      </div>
    </>
  )
}

export default App


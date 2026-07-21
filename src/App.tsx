import TarefaItem from "./componentes/TarefaItem"


function App() {
  return (
    <div>
      <h1>Taskflow</h1>
      <TarefaItem titulo="Estudar React" concluida = {false} prioridade = "alta" />
      <TarefaItem titulo="Terminar a API" concluida = {true} />
    </div>
  )
}

export default App
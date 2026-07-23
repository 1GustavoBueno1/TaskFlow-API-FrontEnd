import TarefaItem from "./componentes/TarefaItem"
import type { Tarefa } from "./type"



const tarefas:  Tarefa[] = [
  {id: 1, titulo: "estudo", concluida: true, prioridade: "alta"},
  {id: 2, titulo: "Terminar API", concluida: true},
  {id: 3, titulo: "Revisar ETP", concluida: false, prioridade: "baixa" },
];


function App() {
  return (
    <div>
      <h1>Taskflow</h1>
      {tarefas.map((tarefa) => (
        <TarefaItem key={tarefa.id}
        tarefa={tarefa}
        />
      ))}
    </div>
  )
}

export default App
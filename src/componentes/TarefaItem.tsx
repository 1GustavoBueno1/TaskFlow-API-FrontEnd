import type { Tarefa } from "../type";

interface TarefaItemProps {
    tarefa: Tarefa
}

function TarefaItem({tarefa}: TarefaItemProps) {
    return (
        <div>
            <strong>{tarefa.titulo}</strong>
            <span>  {tarefa.concluida ? "v": "o"}  </span>
           <em>Prioridade: ({tarefa.prioridade})</em>
        </div>
    )
}

export default TarefaItem
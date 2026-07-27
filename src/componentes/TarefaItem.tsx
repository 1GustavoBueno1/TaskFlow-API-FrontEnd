import type { Tarefa } from "../type";

interface TarefaItemProps {
    tarefa: Tarefa
}

function TarefaItem({tarefa}: TarefaItemProps) {
    return (
        <div>
            <strong>{tarefa.nome}</strong>
            <span>  {tarefa.status ? "v": "o"}  </span>
           <em>Descrição: ({tarefa.descrição})</em>
        </div>
    )
}

export default TarefaItem
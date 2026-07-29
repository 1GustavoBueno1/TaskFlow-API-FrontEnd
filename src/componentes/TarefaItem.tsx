import type { Tarefa } from "../type";

interface TarefaItemProps {
    tarefa: Tarefa,
    ondelete: (id: number) => void
}

function TarefaItem({tarefa, ondelete}: TarefaItemProps) {
    return (
        <div>
            <strong>{tarefa.nome}</strong>
            <span>  {tarefa.status ? "v": "o"}  </span>
           <em>Descrição: ({tarefa.descrição})</em>
           <p>id: {tarefa.id}</p>
           <button onClick={() => ondelete(tarefa.id)}>Excluir</button>
        </div>
    )
}

export default TarefaItem
interface TarefaItemProps {
    titulo: string;
    concluida: boolean
    prioridade?: "baixa" | "media" | "alta";
}

function TarefaItem({titulo, concluida, prioridade = "media"}: TarefaItemProps) {
    return (
        <div>
            <strong>{titulo}</strong>
            <span>  {concluida ? "v": "o"}  </span>
           <em>Prioridade: ({prioridade})</em>
        </div>
    )
}

export default TarefaItem
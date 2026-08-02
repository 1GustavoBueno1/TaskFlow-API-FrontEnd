import {useState } from "react";
import type { Tarefa } from "../type";

interface TarefaItemProps {
    tarefa: Tarefa;
    estaEditando: boolean;
    onEditar: (id: number) => void;
    onSalvar: (id: number, novoNome: string) => void;
    onCancelar: () => void;
    ondelete: (id: number) => void;
}

function TarefaItem({tarefa, estaEditando, onEditar, onSalvar, onCancelar, ondelete}: TarefaItemProps) {
    const [texto, setTexto] = useState(tarefa.nome)
    if (estaEditando) {
        return (
            <div>
                <input value={texto} onChange={(e) => setTexto((e.target.value))} />
                <button onClick={() => onSalvar(tarefa.id, texto)}>Salvar</button>
                <button onClick={onCancelar}>Cancelar</button>
            </div>
        );
    }
    return (
        <div>
            <strong>{tarefa.nome}</strong>
            <span>  {tarefa.status ? "v": "o"}  </span>
           <em>Descrição: ({tarefa.descricao})</em>
           <p>id: {tarefa.id}</p>
           <button onClick={() => onEditar(tarefa.id)}>Editar</button>
           <button onClick={() => ondelete(tarefa.id)}>Excluir</button>

        </div>
    )
}

export default TarefaItem
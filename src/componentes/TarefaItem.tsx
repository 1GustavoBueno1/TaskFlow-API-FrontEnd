import {useState } from "react";
import type { Tarefa } from "../type";

export interface DadosEdicao {
    nome: string;
    descricao: string;
    status: string;
}

interface TarefaItemProps {
    tarefa: Tarefa;
    estaEditando: boolean;
    onEditar: (id: number) => void;
    onSalvar: (id: number, dados: DadosEdicao) => void;
    onCancelar: () => void;
    ondelete: (id: number) => void;
}

function TarefaItem({tarefa, estaEditando, onEditar, onSalvar, onCancelar, ondelete}: TarefaItemProps) {
    const [form, setForm] = useState ({
        nome: tarefa.nome,
        descricao: tarefa.descricao ?? "",
        status: tarefa.status
    })
    async function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
          const {name, value} = e.target
          setForm((anterior) => ({ ...anterior, [name]: value}));
        }
    if (estaEditando) {
        return (
            <div>
                <input name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Nome" 
                />
                <input name="descricao"
                value={form.descricao}
                onChange={handleChange}
                placeholder="Descrição" 
                />
                <select name="status" value={form.status} onChange={handleChange}>
                    <option value="pendente">Pendente</option>
                    <option value="concluida">Concluida</option>
                </select>
                <button onClick={() => onSalvar(tarefa.id, form)}>Salvar</button>
                <button onClick={() => onCancelar()}>Cancelar</button>
            </div>
        );
    }
    return (
        <div>
            <strong>{tarefa.nome}</strong>
            <span>  {tarefa.status === "concluida" ? "✓" : "o"}  </span>
           <em>Descrição: ({tarefa.descricao})</em>
           <p>id: {tarefa.id}</p>
           <button onClick={() => onEditar(tarefa.id)}>Editar</button>
           <button onClick={() => ondelete(tarefa.id)}>Excluir</button>

        </div>
    )
}

export default TarefaItem
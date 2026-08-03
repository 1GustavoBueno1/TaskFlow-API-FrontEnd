import React, { useState, useEffect } from "react"
import TarefaItem from "./componentes/TarefaItem"
import type { Tarefa } from "./type"
import type {DadosEdicao} from "./componentes/TarefaItem"

const API = "http://localhost:8000";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzg1NzI2NzAzfQ.X072aSpVVR5cZBsnwI9FM_JDWvZpwir0qKJN-H0NXhk";

function App() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [novoNome, setNovoNome] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erroOperacao, setErroOperacao] = useState<string | null>(null);
  const [erroCarregamento, setErroCarregamento] = useState<string | null>(null);
  const [editandoId, setEditandoId] = useState<number | null>(null);


  async function carregarTarefas() {
    try {
      const resposta = await fetch(`${API}/tarefas/visualizar_tarefas`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      if (!resposta.ok) {
        throw new Error(`Erro ${resposta.status}`);
      }
      const dados: Tarefa[] = await resposta.json();
      setTarefas(dados);
    } catch (e) {
      setErroCarregamento(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarTarefas();
  }, []);

  // Criar tarefas
  async function handleCriar(e: React.FormEvent) {
    e.preventDefault();

    const nome = novoNome.trim();
    if (!nome) return;

    setEnviando(true);
    setErroOperacao(null);

    try {
      const resposta = await fetch(`${API}/tarefas/criar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({ nome }),
      });

      if (!resposta.ok) {
        const corpo = await resposta.json().catch(() => null);
        throw new Error(corpo?.detail ?? `Erro ${resposta.status}`);
      }

      await carregarTarefas();
      setNovoNome("");
    } catch (e) {
      setErroOperacao(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setEnviando(false);
    }
  }
  async function handleDeletar(id :number) {
    if (!window.confirm("Excluir tarefa?")) return
    try {
      const resposta = await fetch(`${API}/tarefas/deletar_tarefa/${id}`, {
      method: "DELETE",
      headers: {Authorization: `Bearer ${TOKEN}`}
      });
      if (!resposta.ok) {
          const corpo = await resposta.json().catch(() => null);
          throw new Error(corpo?.detail ?? `Erro ${resposta.status}`);
        }
      await carregarTarefas()
      } catch(e) {
        setErroOperacao(e instanceof Error ? e.message: "Erro desconhecido")
      }
    }
    async function handleEditar(id: number, dados: DadosEdicao) {
      setErroCarregamento(null);
      
      try {
          const resposta = await fetch(`${API}/tarefas/editar_tarefa/${id}`, 
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${TOKEN}`
            }, body: JSON.stringify({nome: dados.nome, descricao: dados.descricao, status: dados.status})})
          if (!resposta.ok) {
            const corpo = await resposta.json().catch(() => null);
            throw new Error((corpo?.detail ?? `Erro ${resposta.status}`))
          }
          await carregarTarefas()
          setEditandoId(null)
      } catch(e) {
        setErroOperacao(e instanceof Error ? e.message : "Erro desconhecido")
      }
    }
  if (carregando) return <p>Carregando...</p>
  if (erroCarregamento) return <p>Deu erro no carregamento: {erroCarregamento}</p>

  return (
    <div>
      <h1>Taskflow</h1>

      <form onSubmit={handleCriar}>
        <input
          value={novoNome}
          onChange={(e) => setNovoNome(e.target.value)}
          placeholder="Nova tarefa"
          disabled={enviando}
        />
        <button type="submit" disabled={enviando || !novoNome.trim()}>
          {enviando ? "Salvando..." : "Adicionar"}
        </button>
      </form>

      {erroOperacao && <p style={{ color: "red" }}>{erroOperacao}</p>}

      {tarefas.length === 0 && <p>Nenhuma tarefa por aqui.</p>}
      {tarefas.map((tarefa) => (
        <TarefaItem
          key={tarefa.id}
          tarefa={tarefa}
          estaEditando={editandoId === tarefa.id}
          onEditar={setEditandoId}
          onSalvar={handleEditar}
          onCancelar={() => setEditandoId(null)}
          ondelete={handleDeletar}
        />
      ))}
    </div>
  );
}

export default App
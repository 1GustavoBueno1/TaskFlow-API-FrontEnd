import React, { useState, useEffect } from "react"
import TarefaItem from "./componentes/TarefaItem"
import type { Tarefa } from "./type"
import type {DadosEdicao} from "./componentes/TarefaItem"
import Login from "./componentes/login"

const API = "http://localhost:8000";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzg1Nzk2MzU3fQ.inAYh5H1v7h0PQOC_Cq3F1YuGPSrBY5Y3JqLGMeos8Q";

function App() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [novoNome, setNovoNome] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erroOperacao, setErroOperacao] = useState<string | null>(null);
  const [erroCarregamento, setErroCarregamento] = useState<string | null>(null);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("token")
  );


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
    if (token) carregarTarefas()}, [token])
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
    function handleLoginSucesso(novoToken: string) {
      localStorage.setItem("token", novoToken)
      setToken(novoToken)
    }
    function handleLogout() {
      localStorage.removeItem("token");
      setToken(null)
    }
    if (!token) {
      return <Login onLogin={handleLoginSucesso}/>
    }

  if (carregando) return <p>Carregando...</p>
  if (erroCarregamento) return <p>Deu erro no carregamento: {erroCarregamento}</p>
  return (
    <div>
      <h1>Taskflow</h1>
      <button onClick={handleLogout}>Sair</button>
      
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
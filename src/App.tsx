import React, { useState, useEffect } from "react"
import TarefaItem from "./componentes/TarefaItem"
import type { Tarefa } from "./type"

const API = "http://localhost:8000";
const TOKEN = "";

function App() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [novoNome, setNovoNome] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erroOperacao, setErroOperacao] = useState<string | null>(null);
  const [erroCarregamento, setErroCarregamento] = useState<string | null>(null);

  // AQUI: no corpo do componente, fora do useEffect
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

  // o useEffect só chama
  useEffect(() => {
    carregarTarefas();
  }, []);

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
        <TarefaItem key={tarefa.id} tarefa={tarefa} />
      ))}
    </div>
  );
}

export default App
import React, { useState, useEffect } from "react"
import TarefaItem from "./componentes/TarefaItem"
import type { Tarefa } from "./type"
const API = "http://localhost:8000";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzg0OTQ1OTY0fQ.JvS2HR-YtuocWuQzljNkOQ4cTx9FGI1vu_qrTJCi38s"

function App() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [NovoTitulo, setNovoTitulo] = useState("");
  const [enviando, setEnviando] = useState((false));
  const [erroOperacao, seterroOperacao] = useState<string | null>(null);
  const [erroCarregamento, setErroCarregamento] = useState<string | null>(null);
useEffect(() => {
  async function carregarTarefas() {
    try {
      const resposta = await fetch("http://localhost:8000/tarefas/visualizar_tarefas", {headers: {Authorization: `Bearer ${TOKEN}`},});
      if (!resposta.ok) {
        throw new Error(`Erro ${resposta.status}`)
      }
      const dados: Tarefa[] = await resposta.json()
      setTarefas(dados);
    }
    catch (e) {
      setErroCarregamento(e instanceof Error ? e.message: "Erro desconhecido");
    }
    finally {
      setCarregando(false);
    }
  }
  carregarTarefas()
}, [])
async function handleCriar(e: React.FormEvent) {
    e.preventDefault();
    const Titulo = NovoTitulo.trim()
    if (!Titulo) return;
    setEnviando(true)
    seterroOperacao(null)
    try {
      const resposta = await fetch(`${API}/tarefas/criar_tarefa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({Titulo})
      })
      if (!resposta.ok){
        const corpo = await resposta.json().catch(() => null)
        throw new Error(corpo?.detail ?? `Erro ${resposta.status}`)

      }
      const criada: Tarefa = await resposta.json()
      setTarefas((anteriores) => [...anteriores, criada])
      setNovoTitulo("")
    } catch(e) {
        seterroOperacao(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setEnviando(false)
    }
  }
if (carregando) return <p>Carregando...</p>
if (erroCarregamento) return <p>Deu erro no carregamento: {erroCarregamento}</p>

return (
  <div>
    <h1>Taskflow</h1>
    <form onSubmit={handleCriar}>
      <input 
        value={NovoTitulo}
        onChange={(e) => setNovoTitulo(e.target.value)}
        placeholder="NovaTarefa"
        disabled={enviando}
        />
        <button type="submit" disabled={enviando || !NovoTitulo.trim()}>
          {enviando ? "Salvando..." : "Adicionar"}
        </button>
        {erroOperacao && <p style={{ color: "red" }}>{erroOperacao}</p>}
    </form>
    {tarefas.length === 0 && <p>Nenhuma tarefa por aqui.</p>}
    {tarefas.map((tarefa) => (<TarefaItem key={tarefa.id} tarefa={tarefa} />
    ))}
  </div>
)
}

export default App
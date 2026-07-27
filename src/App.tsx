import { useState, useEffect } from "react"
import TarefaItem from "./componentes/TarefaItem"
import type { Tarefa } from "./type"

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzg0OTQ1OTY0fQ.JvS2HR-YtuocWuQzljNkOQ4cTx9FGI1vu_qrTJCi38s"

function App() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
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
        setErro(e instanceof Error ? e.message: "Erro desconhecido");
      }
      finally {
        setCarregando(false);
      }
    }
    carregarTarefas()
  }, [])
  if (carregando) return <p>Carregando...</p>
  if (erro) return <p>Deu erro: {erro}</p>


  return (
    <div>
      <h1>Taskflow</h1>
      {tarefas.length === 0 && <p>Nenhuma tarefa por aqui.</p>}
      {tarefas.map((tarefa) => (<TarefaItem key={tarefa.id} tarefa={tarefa} />
      ))}
    </div>
  )
}

export default App
import { useState } from "react"

const API = "http://localhost:8000";

interface LoginProps {
    onLogin: (token: string) => void
}

function Login({onLogin}: LoginProps) {
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [erro, setErro] = useState<string | null>(null)
    const [entrando, setEntrando] = useState(false)


async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)
    setEntrando(true)
    try {
        const corpo = new URLSearchParams()
        corpo.append("username", email)
        corpo.append("password", senha)
        const resposta = await fetch(`${API}/usuario/login`, {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: corpo,
        })
        if (!resposta.ok) {
            const erro = await resposta.json().catch(() => null)
            throw new Error(erro?.detail ?? "Email ou senha Invalidos")
        }
        const dados = await resposta.json()
        onLogin(dados.access_token)
    } catch(e) {
        setErro(e instanceof Error ? e.message : "Erro ao entrar")
    } finally {
        setEntrando(false)
    }
}
return (
    <form onSubmit={handleSubmit}>
        <h1>Entrar</h1>
        <input type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        />
        <input type="password"
        value={senha} 
        onChange={(e) => setSenha(e.target.value)}
        placeholder="Senha"
        />
        <button type="submit" disabled={entrando}>
            {entrando ? "Entrando..." : "Entrar"}
        </button>
        {erro && <p style={{ color: "red"}}>{erro}</p>}
    </form>
)
}

export default Login;
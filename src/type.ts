export interface Tarefa {
    id: number
    titulo: string
    concluida: boolean
    prioridade?: "baixa" | "media" | "alta"
}
import { Router, Request, Response } from "express";
import { TasksRepository } from "../repositories/tasksRepository"; // Importando o repositório de tarefas
import axios from "axios"; // Usado para fazer requisições ao serviço Python

const router = Router();
const tasksRepository = new TasksRepository(); // Instanciando o repositório de tarefas

// Idiomas suportados
const supportedLanguages = ["pt", "en", "es"];

// POST /tasks: Cria uma tarefa e solicita o resumo ao serviço Python
router.post("/", async (req: Request, res: Response) => {
  try {
    const { text, lang } = req.body;  // Recebe o texto e o idioma da requisição

    // Verifica se o idioma é suportado
    if (!supportedLanguages.includes(lang)) {
      return res.status(400).json({ error: "Language not supported" });
    }

    // Verifica se o texto foi enviado
    if (!text) {
      return res.status(400).json({ error: 'Campo "text" é obrigatório.' });
    }

    // Cria a tarefa e armazena
    const task = tasksRepository.createTask(text, lang);

    // Chama o serviço Python para gerar o resumo
    const response = await axios.post("http://localhost:5000/generate-summary", { text, lang });
    const summary = response.data.summary; // Recebe o resumo do serviço Python

    // Atualiza a tarefa com o resumo
    tasksRepository.updateTask(task.id, summary);

    // Retorna a resposta com a tarefa criada e o resumo gerado
    return res.status(201).json({
      message: "Tarefa criada com sucesso!",
      task: tasksRepository.getTaskById(task.id),
    });
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    return res.status(500).json({ error: "Ocorreu um erro ao criar a tarefa." });
  }
});

// Rota para pegar uma tarefa pelo ID
router.get("/:id", (req: Request, res: Response) => {
  const task = tasksRepository.getTaskById(Number(req.params.id));
  if (!task) {
    return res.status(404).json({ error: "Tarefa não encontrada." });
  }
  return res.json(task);
});

// Rota para deletar uma tarefa pelo ID
router.delete("/:id", (req: Request, res: Response) => {
  const task = tasksRepository.deleteTask(Number(req.params.id));
  if (!task) {
    return res.status(404).json({ error: "Tarefa não encontrada." });
  }
  return res.status(200).json({ message: "Tarefa removida com sucesso." });
});

// Rota inicial, apenas para verificar se a API está rodando
router.get("/", (req: Request, res: Response) => {
  return res.json({ message: "API is running" });
});

export default router;

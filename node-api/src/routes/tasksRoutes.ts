import { Router, Request, Response } from "express";
import { TasksRepository } from "../repositories/tasksRepository"; 
import axios from "axios"; 

const router = Router();
const tasksRepository = new TasksRepository(); 

const supportedLanguages = ["pt", "en", "es"];

router.post("/", async (req: Request, res: Response) => {
  try {
    const { text, lang } = req.body;

    if (!supportedLanguages.includes(lang)) {
      return res.status(400).json({ error: "Language not supported" });
    }

    if (!text) {
      return res.status(400).json({ error: 'Campo "text" é obrigatório.' });
    }

    const task = tasksRepository.createTask(text, lang);

    const response = await axios.post("http://localhost:5000/generate-summary", { text, lang });
    const summary = response.data.summary;

    tasksRepository.updateTask(task.id, summary);

    return res.status(201).json({
      message: "Tarefa criada com sucesso!",
      task: tasksRepository.getTaskById(task.id),
    });
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    return res.status(500).json({ error: "Ocorreu um erro ao criar a tarefa." });
  }
});

router.get("/:id", (req: Request, res: Response) => {
  const task = tasksRepository.getTaskById(Number(req.params.id));
  if (!task) {
    return res.status(404).json({ error: "Tarefa não encontrada." });
  }
  return res.json(task);
});

router.delete("/:id", (req: Request, res: Response) => {
  const task = tasksRepository.deleteTask(Number(req.params.id));
  if (!task) {
    return res.status(404).json({ error: "Tarefa não encontrada." });
  }
  return res.status(200).json({ message: "Tarefa removida com sucesso." });
});

router.get("/", (req: Request, res: Response) => {
  return res.json({ message: "API is running" });
});

export default router;

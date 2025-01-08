import express from "express";
import tasksRoutes from "./routes/tasksRoutes"; // Certifique-se de ajustar o caminho conforme necessário

const app = express();

// Middleware para leitura do corpo da requisição (JSON)
app.use(express.json());

// Usando as rotas de tarefas
app.use("/tasks", tasksRoutes);

// Rota inicial
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

export default app;

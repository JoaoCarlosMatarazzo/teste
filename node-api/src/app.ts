import express from "express";
import tasksRoutes from "./routes/tasksRoutes";
const app = express();

app.use(express.json());
app.use("/tasks", tasksRoutes);
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

export default app;

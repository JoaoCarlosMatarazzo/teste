import fs from "fs";
import path from "path";

// Caminho para o arquivo de tarefas
const tasksFilePath = path.join(__dirname, "tasks.json");

export class TasksRepository {
  // Carregar tarefas do arquivo
  loadTasksFromFile() {
    if (fs.existsSync(tasksFilePath)) {
      const fileData = fs.readFileSync(tasksFilePath, "utf-8");
      return JSON.parse(fileData);
    }
    return [];
  }

  // Salvar tarefas no arquivo
  saveTasksToFile(tasks: any[]) {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
  }

  // Criar uma nova tarefa
  createTask(text: string, lang: string) {
    const tasks = this.loadTasksFromFile();
    const newTask = {
      id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
      text,
      summary: "",
      lang,
    };
    tasks.push(newTask);
    this.saveTasksToFile(tasks);
    return newTask;
  }

  // Obter uma tarefa pelo ID
  getTaskById(id: number) {
    const tasks = this.loadTasksFromFile();
    return tasks.find((task: any) => task.id === id);
  }

  // Atualizar uma tarefa com o resumo gerado
  updateTask(id: number, summary: string) {
    const tasks = this.loadTasksFromFile();
    const taskIndex = tasks.findIndex((task: any) => task.id === id);
    if (taskIndex !== -1) {
      tasks[taskIndex].summary = summary;
      this.saveTasksToFile(tasks);
      return tasks[taskIndex];
    }
    return null;
  }

  // Deletar uma tarefa pelo ID
  deleteTask(id: number) {
    const tasks = this.loadTasksFromFile();
    const taskIndex = tasks.findIndex((task: any) => task.id === id);
    if (taskIndex !== -1) {
      const deletedTask = tasks.splice(taskIndex, 1);
      this.saveTasksToFile(tasks);
      return deletedTask[0];
    }
    return null;
  }
}

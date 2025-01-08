import fs from "fs";
import path from "path";

const tasksFilePath = path.join(__dirname, "tasks.json");

export class TasksRepository {
  loadTasksFromFile() {
    if (fs.existsSync(tasksFilePath)) {
      const fileData = fs.readFileSync(tasksFilePath, "utf-8");
      return JSON.parse(fileData);
    }
    return [];
  }

  saveTasksToFile(tasks: any[]) {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
  }

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

  getTaskById(id: number) {
    const tasks = this.loadTasksFromFile();
    return tasks.find((task: any) => task.id === id);
  }

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

import { Component } from '@angular/core';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TodoComponent {
  tasks: Task[] = [
    { id: 1, title: 'Buy Ticket', completed: false },
    { id: 2, title: 'Read a Book', completed: false },
    { id: 3, title: 'Clean Desk', completed: true },
  ];

  newTaskTitle: string = '';
  editingTaskId: number | null = null;
  editingTitle: string = '';

  addTask(): void {
    if (this.newTaskTitle.trim()) {
      this.tasks.push({
        id: Date.now(),
        title: this.newTaskTitle.trim(),
        completed: false,
      });
      this.newTaskTitle = '';
    }
  }

  startEditing(task: Task): void {
    this.editingTaskId = task.id;
    this.editingTitle = task.title;
  }

  saveTask(task: Task): void {
    if (this.editingTaskId === task.id && this.editingTitle.trim()) {
      task.title = this.editingTitle.trim();
      this.cancelEditing();
    }
  }

  cancelEditing(): void {
    this.editingTaskId = null;
    this.editingTitle = '';
  }

  toggleCompletion(task: Task): void {
    task.completed = !task.completed;
  }

  deleteTask(taskId: number): void {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
  }
}

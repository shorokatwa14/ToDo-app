import { Component, OnInit } from '@angular/core';
import { Todo, TodoService } from '../services/todo.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {
  tasks: Todo[] = [];
  newTaskTitle: string = '';
  editingTaskId: string | null = null;
  editingTitle: string = '';

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.tasks = todos;
      },
      error: (error) => {
        console.error('Error fetching todos:', error);
      }
    });
  }

  addTask(): void {
    // Prevent adding empty tasks
    if (!this.newTaskTitle.trim()) return;

    const newTask: Todo = {
      title: this.newTaskTitle.trim(),
      completed: false
    };

    this.todoService.addTodo(newTask)
      .then(() => {
        this.newTaskTitle = ''; // Clear input after successful add
      })
      .catch((error) => {
        console.error('Error adding task:', error);
      });
  }

  toggleCompletion(task: Todo): void {
    if (!task.id) return;

    const updatedTask = { ...task, completed: !task.completed };
    this.todoService.updateTodo(updatedTask)
      .catch((error) => {
        console.error('Error updating task:', error);
      });
  }

  startEditing(task: Todo): void {
    this.editingTaskId = task.id || null;
    this.editingTitle = task.title;
  }

  saveTask(task: Todo): void {
    if (!this.editingTitle.trim()) return;

    const updatedTask = { 
      ...task, 
      title: this.editingTitle.trim() 
    };

    this.todoService.updateTodo(updatedTask)
      .then(() => {
        this.cancelEditing();
      })
      .catch((error) => {
        console.error('Error saving task:', error);
      });
  }

  cancelEditing(): void {
    this.editingTaskId = null;
    this.editingTitle = '';
  }

  deleteTask(taskId?: string): void {
    if (!taskId) {
      console.error('Cannot delete task: No ID provided');
      return;
    }
  
    this.todoService.deleteTodo(taskId)
      .catch((error) => {
        console.error('Error deleting task:', error);
      });
  }
}
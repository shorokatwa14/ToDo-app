import { Component, OnInit } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { Todo } from '../interface/todo';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {
  tasks: Todo[] = [];
  taskForm: FormGroup;
  newTaskTitle: string = '';
  editingTaskId: string | null = null;
  editingTitle: string = '';
  showDeleteAllModal: boolean = false;
  snackbarMessage: string = '';
  showSnackbar: boolean = false;

  constructor(
    private todoService: TodoService,
    private fb: FormBuilder
  ) {
    this.taskForm = this.fb.group({
      newTaskTitle: ['', []]
    });
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  showSnackbarMessage(message: string): void {
    this.snackbarMessage = message;
    this.showSnackbar = true;
    setTimeout(() => {
      this.showSnackbar = false;
    }, 3000);
  }

  loadTasks(): void {
    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.tasks = todos;
      },
      error: (error) => {
        console.error('Error fetching todos:', error);
        this.showSnackbarMessage('Failed to load tasks');
      }
    });
  }

  addTask(): void {
    if (this.taskForm.invalid) {
      return;
    }

    const newTask: Todo = {
      title: this.taskForm.get('newTaskTitle')!.value.trim(),
      completed: false
    };

    this.todoService.addTodo(newTask)
      .then(() => {
        this.showSnackbarMessage('Task added successfully');
      })
      .catch((error) => {
        console.error('Error adding task:', error);
        this.showSnackbarMessage('Failed to add task');
      });

    this.taskForm.reset();
  }

  toggleCompletion(task: Todo): void {
    if (!task.id) return;

    const updatedTask = { ...task, completed: !task.completed };
    this.todoService.updateTodo(updatedTask)
      .then(() => {
        this.showSnackbarMessage('Task status updated');
      })
      .catch((error) => {
        console.error('Error updating task:', error);
        this.showSnackbarMessage('Failed to update task');
      });
  }

  saveTask(task: Todo): void {
    if (!this.editingTitle.trim()) return;

    const updatedTask = {
      ...task,
      title: this.editingTitle.trim()
    };

    this.todoService.updateTodo(updatedTask)
      .then(() => {
        this.toggleEditing(task);
        this.showSnackbarMessage('Task updated successfully');
      })
      .catch((error) => {
        console.error('Error saving task:', error);
        this.showSnackbarMessage('Failed to update task');
      });
  }

  toggleEditing(task: Todo): void {
    if (this.editingTaskId === task.id) {
      this.editingTaskId = null;
      this.editingTitle = '';
    } else {
      this.editingTaskId = task.id || null;
      this.editingTitle = task.title;
    }
  }

  deleteTask(taskId: string): void {
    this.todoService.deleteTodo(taskId)
      .then(() => {
        this.showSnackbarMessage('Task deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting task:', error);
        this.showSnackbarMessage('Failed to delete task');
      });
  }

  clearAllTasks(): void {
    this.todoService.deleteAllTodos()
      .then(() => {
        this.tasks = [];
        this.showSnackbarMessage('All tasks deleted successfully');
      })
      .catch((error) => {
        console.error('Error clearing all tasks:', error);
        this.showSnackbarMessage('Failed to delete all tasks');
      });
  }

  openDeleteAllModal(): void {
    this.showDeleteAllModal = true;
  }

  closeDeleteAllModal(): void {
    this.showDeleteAllModal = false;
  }

  confirmDeleteAll(): void {
    this.todoService.deleteAllTodos()
      .then(() => {
        this.tasks = [];
        this.closeDeleteAllModal();
        this.showSnackbarMessage('All tasks deleted successfully');
      })
      .catch((error) => {
        console.error('Error clearing all tasks:', error);
        this.showSnackbarMessage('Failed to delete all tasks');
      });
  }
}
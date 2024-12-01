import { Component, OnInit } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { Todo } from '../interface/todo';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
  isFocused: boolean = false;

  constructor(private todoService: TodoService ,private fb: FormBuilder) {
  this.taskForm = this.fb.group({
    newTaskTitle: ['', [Validators.required, Validators.minLength(3)]]
  });
}
   ngOnInit(): void {
    this.loadTasks();
  }
  
   loadTasks(): void {
    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.tasks = todos;
      },
      error: (error) => {
        console.error('Error fetching todos:', error);
      }
    });
  }
  onFocus(): void {
    // Show validation errors only when input is focused
    this.isFocused = true;
  }

  onBlur(): void {
    // Hide validation errors when focus leaves the input
    this.isFocused = false;
  }

  addTask(): void {
      // Show validation error when trying to submit
      this.isFocused = true;

      if (this.taskForm.invalid) {
        return;
      }
    const newTask: Todo = {
      title: this.taskForm.get('newTaskTitle')!.value.trim(),
      completed: false
    };

    this.todoService.addTodo(newTask)
      .then(() => {
        this.taskForm.reset();
        this.isFocused = false;

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

 
  saveTask(task: Todo): void {
    if (!this.editingTitle.trim()) return;

    const updatedTask = { 
      ...task, 
      title: this.editingTitle.trim() 
    };

    this.todoService.updateTodo(updatedTask)
      .then(() => {
        this.toggleEditing(task);
      })
      .catch((error) => {
        console.error('Error saving task:', error);
      });
  }

 
  toggleEditing(task: Todo): void {
    if (this.editingTaskId === task.id) {
      // If currently editing the same task, cancel editing
      this.editingTaskId = null;
      this.editingTitle = '';
    } else {
      // Start editing the new task
      this.editingTaskId = task.id || null;
      this.editingTitle = task.title;
    }
  }
  deleteTask(taskId: string): void {
  
    this.todoService.deleteTodo(taskId)
      .catch((error) => {
        console.error('Error deleting task:', error);
      });
  }
  clearAllTasks(): void {
    this.todoService.deleteAllTodos()
      .then(() => {
        // Clear the local tasks array
        this.tasks = [];
      })
      .catch((error) => {
        console.error('Error clearing all tasks:', error);
      });
  }
  // Modal Logic
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
      })
      .catch((error) => {
        console.error('Error clearing all tasks:', error);
      });
  }
  get newTaskTitleControl() {
    return this.taskForm.get('newTaskTitle');
  }
}

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

  constructor(private todoService: TodoService ,private fb: FormBuilder) {
  this.taskForm = this.fb.group({
    newTaskTitle: ['', []]
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

    })
    .catch((error) => {
      console.error('Error adding task:', error);
    });

    this.taskForm.reset();
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
        this.tasks = [];
      })
      .catch((error) => {
        console.error('Error clearing all tasks:', error);
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
    })
    .catch((error) => {
      console.error('Error clearing all tasks:', error);
    });
}
}


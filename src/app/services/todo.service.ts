import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, updateDoc, deleteDoc, query, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Todo {
  id?: string;
  title: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todoCollection = collection(this.firestore, 'todos');

  constructor(private firestore: Firestore) {}

  getTodos(): Observable<Todo[]> {
    const todoQuery = query(this.todoCollection, orderBy('completed', 'asc'));
    return collectionData(todoQuery, { idField: 'id' }) as Observable<Todo[]>;
  }

   addTodo(todo: Todo): Promise<any> {
    return addDoc(this.todoCollection, todo);
  }
  
  async updateTodo(todo: Todo): Promise<void> {
    if (!todo.id) return;
    const todoDocRef = doc(this.firestore, `todos/${todo.id}`);
    return updateDoc(todoDocRef, {
      title: todo.title,
      completed: todo.completed
    });
  }

   deleteTodo(id: string): Promise<void> {
    const todoDocRef = doc(this.firestore, `todos/${id}`);
    return deleteDoc(todoDocRef);
  }
}
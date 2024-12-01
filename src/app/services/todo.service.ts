import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, updateDoc, deleteDoc, query, orderBy,DocumentReference ,getDocs, } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Todo } from '../interface/todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todoCollection = collection(this.firestore, 'todos');

  constructor(private firestore: Firestore) {}

  getTodos(): Observable<Todo[]> {
    const todoQuery = query(this.todoCollection, orderBy('title', 'asc'));
    return collectionData(todoQuery, { idField: 'id' }) as Observable<Todo[]>;
  }

   async addTodo(todo: Todo): Promise<DocumentReference> {
    return addDoc(this.todoCollection, todo);
  }
  
   updateTodo(todo: Todo): Promise<void> {
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
  async deleteAllTodos(): Promise<void> {
    const querySnapshot = await getDocs(this.todoCollection);
    
    // Create an array of delete promises
    const deletionPromises = querySnapshot.docs.map(document => 
      deleteDoc(document.ref)
    );

    // Wait for all deletions to complete
    await Promise.all(deletionPromises);
  }

}
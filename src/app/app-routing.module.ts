import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoComponent } from './todo/todo.component';
import { AppIntroComponent } from './app-intro/app-intro.component';

const routes: Routes = [
  {path: '', redirectTo: 'app-intro', pathMatch: 'full'},
  {path : 'todo',component: TodoComponent},
  {path: 'app-intro', component: AppIntroComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

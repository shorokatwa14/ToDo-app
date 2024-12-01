import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-intro',
  templateUrl: './app-intro.component.html',
  styleUrls: ['./app-intro.component.scss']
})
export class AppIntroComponent {
  constructor(private router: Router) {}

  navigateToTodoList(): void {
    this.router.navigate(['todo']);
  }
}

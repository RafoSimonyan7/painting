import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../services/storage.service';
import { User } from '../users/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  users: User[] = [];
  username: string = 'user';

  constructor(private storage: LocalStorageService, private route: Router) {}
  ngOnInit(): void {
    const user = this.storage.get('isSignIn');
    if (user) {
      this.login(user);
    }
  }

  getUsers(): User[] {
    const usersInLocal = this.storage.get(this.username);
    if (usersInLocal) {
      return JSON.parse(usersInLocal);
    }
    return [];
  }

  onSubmit(useremail: string, password: string) {
    this.email = useremail;
    this.password = password;
    const users = this.getUsers();
    users.map((el) => {
      if (el.email === this.email && el.password === this.password) {
        this.login(this.email);
      } else {
        alert('Wrong Email or Password');
      }
    });
  }

  login(email: string) {
    this.storage.set('isSignIn', email)
    this.route.navigate(['/canvas']);
  }
}

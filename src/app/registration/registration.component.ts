import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MustMatch } from '../validators/confirm.validator';
import { User } from '../users/user.model';
import { Router } from '@angular/router';
import { LocalStorageService } from '../services/storage.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  userSignUp: any;
  users: User[] = [];
  username: string = 'user';

  constructor(private fb: FormBuilder, private route: Router, private storage: LocalStorageService) {
    this.userSignUp = this.fb.group({
      firstname: ["", [Validators.required, Validators.minLength(3)]],
      lastname: ["", [Validators.required, Validators.minLength(3)]],
      email: ["", Validators.required],
      password: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      confirmPassword: ['', Validators.required],
    },
    {
      validator: MustMatch('password', 'confirmPassword'),
    })
   }

  ngOnInit(): void {
  }

  email() {
    return this.userSignUp.get('email') as FormControl
  }

  password() {
    return this.userSignUp.get('password') as FormControl
  }

  onSubmit() {
    if (this.userSignUp.valid) {
      this.users.push(new User(this.email().value, this.password().value))
      const user = JSON.stringify(this.users)
      this.storage.set(this.username, user)
      this.storage.set('isSignIn', this.email().value);
      this.route.navigate(['/login'])
    }
    console.log(this.users);
    
    
  }

}

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service'
import { Router } from '@angular/router';
import { LoginService } from '../login.service'

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  private error: string
  private registerMode: boolean

  constructor(private api: ApiService, private router: Router, private loginService: LoginService ) { }

  ngOnInit() {}

  login() {
    const username = (<HTMLInputElement>document.getElementById("username")).value;
    const password = (<HTMLInputElement>document.getElementById("password")).value;
    if(username === '' || password === '') {
      this.error = 'Enter your username and password.'
    } else {
      this.api.login(username, password).subscribe( res => {
        if(res['logged']) {
          this.error = ""
          localStorage.setItem("token", res['token']);
          this.router.navigate(['/']);
          this.loginService.sendLoggedUser(username);
        } else {
          this.error = "Incorrect username or password.";
          (<HTMLInputElement>document.getElementById("username")).value = '';
          (<HTMLInputElement>document.getElementById("password")).value = '';
        }
      });
    }
  }

  register() {
    this.error = '';
    const username = (<HTMLInputElement>document.getElementById("username")).value;
    const email = (<HTMLInputElement>document.getElementById("email")).value;
    const password = (<HTMLInputElement>document.getElementById("password1")).value;
    const password2 = (<HTMLInputElement>document.getElementById("password2")).value;
    if(username === '' || email === '' || password === '' || password2 === '') {
      this.error = "Fill in all details."
    } else {
      if (password !== password2) {
        this.error = "Passwords do not match."
      } else {
        const data = {
          username,
          email,
          password
        }
        this.api.register(data).subscribe( res => {
          if(res['registered']) {
            localStorage.setItem('token', res['token']);
            this.router.navigate(['/']);
            this.loginService.sendLoggedUser(username);
          } else {
            this.error = res['reason'];
          }
        });        
      }
    }
  }

  registerModeChange(mode) {
    this.error = "";
    this.registerMode = mode;
  }
}

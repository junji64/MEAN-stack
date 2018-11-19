import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NgFlashMessageService } from 'ng-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: String;
  password: String;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: NgFlashMessageService
    ) { }

  ngOnInit() {
  }

  onLoginSubmit() {
    // console.log(this.username);
    const user = {
      username: this.username,
      password: this.password
    }

    this.authService.authenticateUser(user).subscribe(data => {
      if(data.success) {
        this.authService.storeUserData(data.token, data.user);
        this.flashMessage.showFlashMessage({
          messages: [data.msg], 
          type: 'success', 
          timeout:3000
        });
        this.router.navigate(['dashboard']);
      } else {
        this.flashMessage.showFlashMessage({
            messages: [data.msg], 
            type: 'danger', 
            timeout:3000
          });
          this.router.navigate(['login']);
      }
    });
  }

}

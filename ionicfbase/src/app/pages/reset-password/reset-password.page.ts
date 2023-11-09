import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FbauthService } from 'src/app/fbauth.service';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  email: any
  constructor(
    public authService: FbauthService,
    public route: Router
  ) {
  }

  ngOnInit() {
  }
  async resetPassword() {
    this.authService.resetPassword(this.email).then(() =>{
      console.log('correo reset enviado')  
      this.route.navigate(['/login'])
    }

    ).catch((error) => {
      console.log(error);
    })
  }
}

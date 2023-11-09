import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadChildrenCallback, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { FbauthService } from 'src/app/fbauth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  regForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private authService: FbauthService,
    private router: Router,
    private alertCtrl: AlertController
  ) {
    this.regForm = this.formBuilder.group({
      fullname: ['', [
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9]{5,20}$")
      ]],

      email: ['', [
        Validators.required,
        Validators.pattern("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")
      ]],

      password: ['', [
        Validators.required,
        Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")
      ]]
    })
  }

  ngOnInit() {
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async signUp() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    let alertHeader = 'Oops! Ha ocurrido un error.';
    let alertMessage = 'Ha ocurrido un error inesperado.';
    let shouldShowAlert = false;

    if (this.regForm?.valid) {
      try {
        const userCredential = await this.authService.registerUser(this.regForm.value.email, this.regForm.value.password);

        if (userCredential.user) {
          await this.authService.sendEmailVerification();
          alertHeader = 'Verificar Correo';
          alertMessage = 'Enviamos un correo de verificacion a tu direccion de correo. Porfavor verifica tu correo antes de continuar';
          // TODO: crear pagina donde se recuerde que debe verificar correo. Debe contener un boton que lleve de vuelta al LOGIN.
          // this.router.navigate(['/verificar']);
          this.router.navigate(['/login'])
          shouldShowAlert = true;
        }
      } catch (error: any) {
        console.log(error);

        if (error.code === 'auth/email-already-in-use') {
          alertMessage = 'La direccion de correo ingresada ya se encuentra en uso.';
        }

        else if (error.code === 'auth/network-request-failed') {
          alertMessage = 'Problema de conexión. Por favor, verifica tu conexión a internet y reintenta la operacion.';
        }

        else if (error?.message && typeof error.message === 'string') {
          alertMessage = 'Ha ocurrido un error inesperado. Reintenta la operacion. Si el problema persiste, pongase en contacto con soporte.';
        }
        shouldShowAlert = true;

      } finally {
        loading.dismiss();
        // Si se levanto la bandera shouldShowAlert, se mostrara esta alerta con dicho error.
        if (shouldShowAlert) {
          this.showAlert(alertHeader, alertMessage);
        }
      }
    } else {
      loading.dismiss();
      console.log('Form is not valid.');
    }
  }
}
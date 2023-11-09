import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { FbauthService } from 'src/app/fbauth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  logForm: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private authService: FbauthService,
    private route: Router,
    private alertCtrl: AlertController
  ) {
    this.logForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.pattern("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")
      ]],

      password: ['', [
        Validators.required,
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

  async logIn() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    let alertHeader = 'Oops! Ha ocurrido un error.';
    let alertMessage = 'Ha ocurrido un error inesperado.';
    let shouldShowAlert = false;

    if (this.logForm?.valid) {
      try {
        const userCredential = await this.authService.login(this.logForm.value.email, this.logForm.value.password);

        //Si el login es valido, userCredential contendra una propiedad user por lo que el usuario existe.
        if (userCredential.user) {
          // Se verifica que el usuario este verificado buscando la propiedad emailVerified.
          if (userCredential.user.emailVerified) {
            this.route.navigate(['/home']);
            return;
          } else {
            // Si no se encuentra la propiedad emailVerified, se modifica el contenido del mensaje de error default
            // a uno correspondiente al de correo no verificado y se levanta la bandera de mostrar error
            alertMessage = 'El correo ingresado no se encuentra verificado. Porfavor verifique el correo antes de avanzar.';
            shouldShowAlert = true;
          }
        }
        // Catch a cualquier error, y lo registra en consola.    
      } catch (error: any) {
        console.log(error);

        if (error.code === 'auth/invalid-login-credentials') {
          alertMessage = 'El correo y/o contraseña no corresponden';
        }

        else if (error.code === 'auth/network-request-failed') {
          alertMessage = 'Problema de conexión. Por favor, verifica tu conexión a internet y reintenta la operacion.';
        }

        else if (error.code === 'auth/too-many-requests') {
          alertMessage = 'Demasiados intentos de sesion fallidos!. Vuelve a intentalo mas tarde o restaura tu contraseña para ingresar inmediatamente.';
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
      console.log('Formulario Invalido.');
    }
  }

}




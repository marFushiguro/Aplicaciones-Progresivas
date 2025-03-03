import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: 'login.page.html',
    styleUrls: ['login.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule] 
})
export class LoginPage {
    loginData = { email: '', password: '' };
    //Daniela Peña Rangel 

    constructor(
        private authService: AuthService, 
        private router: Router,
        private alertController: AlertController,
        private loadingController: LoadingController 
    ) {}

    async onLogin() {
        const loading = await this.loadingController.create({
            message: 'Iniciando sesión...',
            duration: 3000 
        });

        await loading.present(); 

        this.authService.login(this.loginData).then(() => {
            loading.dismiss(); 
            this.router.navigate(['/home']);
        }).catch(async error => {
            console.error('Login error:', error);
            loading.dismiss(); 
            let message = 'Ocurrió un error. Intenta de nuevo.';
            
            if (error.message.includes('contraseña incorrecta')) {
                message = '❌ Contraseña incorrecta';
            } else if (error.message.includes('usuario no encontrado')) {
                message = '❌ El correo ingresado no está registrado';
            }

            const alert = await this.alertController.create({
                header: 'Error de inicio de sesión',
                message: message,
                buttons: ['OK']
            });

            await alert.present();
        });
    }

    irAPaginaRegistro() {
        this.router.navigate(['/register']);
    }
}

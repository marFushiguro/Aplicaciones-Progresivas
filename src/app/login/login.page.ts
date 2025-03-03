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
    imports: [IonicModule, CommonModule, FormsModule] // Asegúrate de que estos módulos estén aquí
})
export class LoginPage {
    loginData = { email: '', password: '' };

    constructor(
        private authService: AuthService, 
        private router: Router,
        private alertController: AlertController,
        private loadingController: LoadingController // INYECTAR LoadingController
    ) {}

    async onLogin() {
        const loading = await this.loadingController.create({
            message: 'Iniciando sesión...',
            duration: 3000 // Duración de 3 segundos para mostrar el loading
        });

        await loading.present(); // Muestra el loading

        this.authService.login(this.loginData).then(() => {
            loading.dismiss(); // Oculta el loading después de iniciar sesión correctamente
            this.router.navigate(['/home']);
        }).catch(async error => {
            console.error('Login error:', error);
            loading.dismiss(); // Si hay un error, también se debe ocultar el loading
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

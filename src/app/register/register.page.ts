import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-register',
    templateUrl: 'register.page.html',  
    styleUrls: ['register.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule]
})
export class RegisterPage {  
    registerData = { username: '', email: '', password: '', confirmPassword: '', role: 'user' };

    constructor(
        private authService: AuthService,
        private router: Router,
        private alertController: AlertController,
        private loadingController: LoadingController
    ) {}

    async onRegister() {
        const loading = await this.loadingController.create({
            message: 'Registrando...',
            duration: 3000
        });

        await loading.present();

        if (this.registerData.password !== this.registerData.confirmPassword) {
            loading.dismiss();
            const alert = await this.alertController.create({
                header: 'Error',
                message: 'Las contraseñas no coinciden.',
                buttons: ['OK']
            });
            await alert.present();
            return;
        }

        this.authService.register(this.registerData).then(() => {
            loading.dismiss();
            this.router.navigate(['/login']); 
        }).catch(async error => {
            loading.dismiss();
            const alert = await this.alertController.create({
                header: 'Error de registro',
                message: 'Hubo un problema al registrar la cuenta. Intenta de nuevo.',
                buttons: ['OK']
            });
            await alert.present();
        });
    }

    irAPaginaLogin() {
        this.router.navigate(['/login']);
    }
}

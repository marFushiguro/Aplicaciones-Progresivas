import { Component } from '@angular/core';
import { Router } from '@angular/router'; // 👈 IMPORTA el servicio Router
import { AuthService } from 'src/app/services/auth.service';
import { IonicModule } from '@ionic/angular';
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

    // ✅ INYECTA el servicio Router en el constructor
    constructor(private authService: AuthService, private router: Router) {}

    onLogin() {
        this.authService.login(this.loginData).then(() => {
            this.router.navigate(['/home']);
        }).catch(error => {
            console.error('Login error:', error);
        });
    }

    // ✅ AÑADE esta función irAPaginaRegistro()
    irAPaginaRegistro() {
        this.router.navigate(['/register']); // Navega a la página de registro PROGRAMÁTICAMENTE
    }
}
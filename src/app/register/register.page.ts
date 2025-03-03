import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-register',
  templateUrl: 'register.page.html',
  styleUrls: ['register.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class RegisterPage {
  registerData = { username: '', email: '', password: '', confirmPassword: '', role: 'user' };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async onRegister() {
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.errorMessage = '❌ Las contraseñas no coinciden';
      return;
    }

    try {
      await this.authService.register({
        username: this.registerData.username,
        email: this.registerData.email,
        password: this.registerData.password,
        role: this.registerData.role
      });

      console.log('✅ Registro exitoso');
      this.router.navigate(['/login']); // Redirige a login después del registro
    } catch (error: any) {
      console.error('❌ Error en el registro:', error);
      this.errorMessage = 'Error al registrar usuario: ' + (error.message || 'Intenta de nuevo');
    }
  }

  irAPaginaLogin() {
    this.router.navigate(['/login']); // Navega a la página de login PROGRAMÁTICAMENTE
}
}

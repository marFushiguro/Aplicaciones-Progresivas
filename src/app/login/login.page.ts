import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../services/auth.service'; // Importa el servicio

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class LoginPage {
  user: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private authService: AuthService 
  ) {}

  async login() {
    
    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
      duration: 3000,
    });

    await loading.present();

    
    setTimeout(() => {
      const credencialesValidas = this.authService.login(this.user, this.password);

      if (credencialesValidas) {
        loading.dismiss();
        this.showLoadingAndNavigate();
      } else {
        loading.dismiss();
        alert('Credenciales incorrectas');
      }
    }, 3000);
  }

  async showLoadingAndNavigate() {
    
    const loading = await this.loadingController.create({
      message: 'Redirigiendo al home...',
      duration: 3000,
    });

    await loading.present();

  
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 3000);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
//autor-Daniela Marbella Peña Rangel
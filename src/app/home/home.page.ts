import { Component } from '@angular/core';
import { IonicModule, LoadingController, NavController } from '@ionic/angular'; 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],  
})
export class HomePage {
  role: string = '';

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private loadingController: LoadingController 
  ) {}

  ngOnInit() {
    this.getRoleFromToken();
  }

  getRoleFromToken() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decodificar token
        this.role = payload.role; // Obtener el rol
      } catch (error) {
        console.error('Error al leer el token:', error);
      }
    }
  }
  //Daniela Peña Rangel

  async goToProfile() {
    const loading = await this.loadingController.create({
      message: 'Cargando perfil...',
      duration: 2000, 
    });
    await loading.present(); 

    this.navCtrl.navigateForward('/profile'); 
  }

  async goToUsers() {
    const loading = await this.loadingController.create({
      message: 'Cargando usuarios...',
      duration: 2000, 
    });
    await loading.present(); 

    this.navCtrl.navigateForward('/admin-users'); 
  }

  isAdmin() {
    return this.role === 'admin';
  }

  async logout() {
    const loading = await this.loadingController.create({
      message: 'Cerrando sesión...',
      duration: 2000, 
    });
    await loading.present(); 

    
    localStorage.removeItem('token');

   
    this.router.navigate(['/login']);
  }
}

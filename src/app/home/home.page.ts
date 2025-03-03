import { Component } from '@angular/core';
import { IonicModule, LoadingController, NavController } from '@ionic/angular'; // Asegúrate de importar todo lo necesario
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // IMPORTAR Router para redirigir

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],  // Asegúrate de que IonicModule esté aquí
})
export class HomePage {
  role: string = '';

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private loadingController: LoadingController // INYECTAR LoadingController
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

  async goToProfile() {
    const loading = await this.loadingController.create({
      message: 'Cargando perfil...',
      duration: 2000, // Duración de 2 segundos para mostrar el loading
    });
    await loading.present(); // Muestra el loading

    this.navCtrl.navigateForward('/profile'); // Navegar a la vista de perfil
  }

  async goToUsers() {
    const loading = await this.loadingController.create({
      message: 'Cargando usuarios...',
      duration: 2000, // Duración de 2 segundos para mostrar el loading
    });
    await loading.present(); // Muestra el loading

    this.navCtrl.navigateForward('/admin-users'); // Navegar a la vista de usuarios
  }

  isAdmin() {
    return this.role === 'admin';
  }

  async logout() {
    const loading = await this.loadingController.create({
      message: 'Cerrando sesión...',
      duration: 2000, // Duración de 2 segundos para mostrar el loading
    });
    await loading.present(); // Muestra el loading

    // Eliminar el token de autenticación
    localStorage.removeItem('token');

    // Redirigir a la página de login después de cerrar sesión
    this.router.navigate(['/login']);
  }
}

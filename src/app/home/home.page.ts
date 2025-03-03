import { Component } from '@angular/core';
import { NavController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // IMPORTAR Router para redirigir

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class HomePage {
  role: string = '';

  constructor(private navCtrl: NavController, private router: Router) {}

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

  goToProfile() {
    this.navCtrl.navigateForward('/profile');
  }

  goToUsers() {
    this.navCtrl.navigateForward('/admin-users'); 
  }

  isAdmin() {
    return this.role === 'admin';
  }

  // Función para hacer logout y redirigir a la vista de login
  logout() {
    // Eliminar el token de autenticación (o hacer la lógica que corresponda)
    localStorage.removeItem('token');
    
    // Redirigir a la página de login
    this.router.navigate(['/login']);
  }
}

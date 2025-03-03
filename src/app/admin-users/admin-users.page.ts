import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, IonicModule } from '@ionic/angular';
import axios from 'axios';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.page.html',
  styleUrls: ['./admin-users.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class AdminUsersPage {
  users: any[] = [];
  userRole: string = '';

  constructor(private navCtrl: NavController, private router: Router, private cdr: ChangeDetectorRef) {}

  async ionViewWillEnter() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.navCtrl.navigateRoot('/login');
      return;
    }

    try {
      const userResponse = await axios.get('http://localhost:3000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      //Daniela Peña Rangel 

      this.userRole = userResponse.data.role;

      if (this.userRole === 'admin') {
        await this.loadUsers();
      } else {
        console.warn('Acceso denegado: No tienes permisos de administrador');
        this.router.navigate(['/profile']);
      }
    } catch (error: any) {
      console.error('Error al obtener usuario:', error.response?.data || error.message);
    }
  }

  async loadUsers() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.navCtrl.navigateRoot('/login');
      return;
    }
  
    try {
      console.log('Solicitando usuarios al servidor...');
      const response = await axios.get('http://localhost:3000/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log('Respuesta completa:', response);
      console.log('Datos recibidos:', response.data);
  
      if (Array.isArray(response.data.users)) {
        this.users = response.data.users;
        console.log('Usuarios cargados:', this.users);
        this.cdr.detectChanges();  
      } else {
        console.error('Error: Respuesta no válida');
        this.users = [];
      }
  
    } catch (error: any) {
      console.error('Error en la solicitud:', {
        mensaje: error.message,
        respuesta: error.response?.data,
        estado: error.response?.status,
      });
      this.users = [];
    }
  }

  goHome() {
    this.router.navigate(['/home']);  
  }

  goToEditUser(uid: string) {
    this.navCtrl.navigateForward(`/edit-user/${uid}`);
  }

  async deleteUser(uid: string) {
    const token = localStorage.getItem('token');
    if (!token) {
      this.navCtrl.navigateRoot('/login');
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/api/users/${uid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.users = this.users.filter((user) => user.uid !== uid);
      console.log('Usuario eliminado correctamente');
    } catch (error: any) {
      console.error('Error al eliminar usuario:', error.response?.data || error.message);
    }
  }

  goToCreateUser() {
    this.navCtrl.navigateForward('/create-user');
  }
}
//2021371074
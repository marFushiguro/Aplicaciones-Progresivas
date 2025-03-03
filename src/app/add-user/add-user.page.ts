/*import { Component } from '@angular/core';
import { NavController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import axios from 'axios';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.page.html',
  styleUrls: ['./add-user.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule] // ✅ Agregamos los módulos necesarios
})
export class AddUserPage {
  email: string = '';
  role: string = 'user'; // Por defecto, el rol es 'user'

  constructor(private navCtrl: NavController) {}

  async addUser() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.navCtrl.navigateRoot('/login');
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/users', {
        email: this.email,
        role: this.role
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Usuario agregado');
      this.navCtrl.navigateBack('/admin-users');
    } catch (error) {
      console.error('Error al agregar usuario:', error);
    }
  }
}*/

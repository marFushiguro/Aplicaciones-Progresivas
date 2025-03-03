import { Component } from '@angular/core';
import { NavController, IonicModule } from '@ionic/angular';
import axios from 'axios';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.page.html', 
  styleUrls: ['./create-user.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule], // Importamos IonicModule y FormsModule
})
export class CreateUserPage {
  newUser = {
    email: '',
    password: '',
    role: 'user',
    username: '',
  };

  constructor(private navCtrl: NavController, private router: Router) {}

  async createUser() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/users', this.newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Usuario creado:', response.data);
      this.router.navigate(['/admin-users']);
    } catch (error: any) {
      console.error('Error al crear usuario:', error.response ? error.response.data : error.message);
    }
  }
}

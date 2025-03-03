import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { IonicModule } from '@ionic/angular'; 
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-user',
  templateUrl: 'edit-user.page.html',
  styleUrls: ['edit-user.page.scss'],
  standalone: true, 
  imports: [IonicModule, FormsModule], 
})
export class EditUserPage {
  user: any = {
    email: '',
    role: 'user',
    username: '',
  };
  uid: string = '';

  //Daniela Peña Rangel

  constructor(private route: ActivatedRoute, private router: Router) {}

  async ionViewWillEnter() {
    this.uid = this.route.snapshot.paramMap.get('uid') || '';
    await this.loadUser();
  }

  async loadUser() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/api/users/${this.uid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      this.user = response.data;
    } catch (error: any) {
      console.error('Error al obtener usuario:', error.response ? error.response.data : error.message);
    }
  }

  async updateUser() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      await axios.put(`http://localhost:3000/api/users/${this.uid}`, this.user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      this.router.navigate(['/admin-users']); // Redirigir a la lista de usuarios
    } catch (error: any) {
      console.error('Error al actualizar usuario:', error.response ? error.response.data : error.message);
    }
  }

  goHome() {
    this.router.navigate(['/home']);  // Redirige al Home
  }
}
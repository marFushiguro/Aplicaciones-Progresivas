import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProfileService } from 'src/app/services/profile.service';
import { Router } from '@angular/router'; // Importa Router para redirecciones

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
  standalone: true, // Habilitar modo standalone
  imports: [IonicModule, CommonModule, FormsModule], // Importar módulos necesarios
})
export class ProfilePage implements OnInit {
  userProfile: any = {}; // Objeto para almacenar los datos del perfil
  token: string | null = null; // Token del usuario
  isAdmin: boolean = false; // Variable para verificar si el usuario es administrador

  constructor(
    private profileService: ProfileService,
    private navCtrl: NavController,
    private router: Router // Inyecta Router para redirecciones
  ) {}

  async ngOnInit() {
    await this.loadUserProfile(); // Cargar el perfil del usuario al iniciar la página
  }

  // Cargar el perfil del usuario
  async loadUserProfile() {
    this.token = localStorage.getItem('token'); // Obtener el token del localStorage

    if (!this.token) {
        console.error('❌ Token no encontrado');
        this.router.navigate(['/login']); // Redirigir al login si no hay token
        return;
    }

    try {
        const profile: any = await this.profileService.getProfile(this.token); // Obtener el perfil
        if (!profile) {
            console.error('❌ No se encontraron datos del perfil');
            return;
        }

        this.userProfile = profile; // Asignar los datos del perfil
        this.isAdmin = this.userProfile.role === 'admin'; // Verificar si el usuario es administrador

        console.log('➡️ loadUserProfile() - Loaded Profile:', this.userProfile); // 👈👈👈 ¡AHORA  ESTÁ  *AL  FINAL*!

    } catch (error) {
        console.error('❌ Error al obtener perfil:', error);
    }
}

 // Editar el perfil del usuario
 async editProfile() {
 
  console.log('➡️  editProfile() - userProfile:', this.userProfile); // 👈  ¡AÑADIDO console.log() AQUÍ!

  if (!this.userProfile || !this.token) return;

  try {
      const updateData = {
          username: this.userProfile.username,
          email: this.userProfile.email,
      };

      await this.profileService.updateProfile(this.token, this.userProfile.uid, updateData);  // 👈👈👈  ¡¡¡USA  `this.userProfile.uid`  EN  LUGAR  DE  `this.userProfile.id`!!!
      alert('✅ Perfil actualizado correctamente');
  } catch (error) {
      console.error('❌ Error al actualizar perfil:', error);
  }
}

  // Eliminar el perfil del usuario (solo para administradores)
  async deleteProfile() {
    if (this.userProfile.role !== 'admin') {
      alert('⛔ No tienes permisos para eliminar usuarios.');
      return;
    }

    if (!confirm(`❗ ¿Estás seguro de eliminar el usuario ${this.userProfile.username}?`)) {
      return;
    }

    try {
      if (!this.token) return;

      await this.profileService.deleteProfile(this.token, this.userProfile.uid);
      alert('✅ Usuario eliminado correctamente');
      this.router.navigate(['/home']); // Redirigir al Home tras la eliminación
    } catch (error) {
      console.error('❌ Error al eliminar usuario:', error);
    }
  }
  async goToHome() {
    this.router.navigate(['/home']);
  }
  
}
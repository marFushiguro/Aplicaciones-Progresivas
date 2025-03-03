import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProfileService } from 'src/app/services/profile.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
  standalone: true, 
  imports: [IonicModule, CommonModule, FormsModule], 
})
export class ProfilePage implements OnInit {
  userProfile: any = {}; //objnpara almacenar los datos del perfil
  token: string | null = null;
  isAdmin: boolean = false; //variable para verificar si el usuario es administrador

  constructor(
    private profileService: ProfileService,
    private navCtrl: NavController,
    private router: Router 
  ) {}

  async ngOnInit() {
    await this.loadUserProfile(); 
  }

  //Daniela Peña Rangel 
  async loadUserProfile() {
    this.token = localStorage.getItem('token'); 

    if (!this.token) {
        console.error('❌ Token no encontrado');
        this.router.navigate(['/login']); 
        return;
    }

    try {
        const profile: any = await this.profileService.getProfile(this.token); 
        if (!profile) {
            console.error('❌ No se encontraron datos del perfil');
            return;
        }

        this.userProfile = profile; 
        this.isAdmin = this.userProfile.role === 'admin'; 

        console.log('➡️ loadUserProfile() - Loaded Profile:', this.userProfile); 

    } catch (error) {
        console.error('❌ Error al obtener perfil:', error);
    }
}

 
 async editProfile() {
 
  console.log('➡️  editProfile() - userProfile:', this.userProfile); // 👈  

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
      this.router.navigate(['/home']); 
    } catch (error) {
      console.error('❌ Error al eliminar usuario:', error);
    }
  }
  async goToHome() {
    this.router.navigate(['/home']);
  }
  
}
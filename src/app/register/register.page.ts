import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../services/auth.service'; // Importa el servicio

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class RegisterPage {
  mail: string = '';
  fullName: string = '';
  user: string = '';
  password: string = '';
  confirmPassword: string = '';
  birthDate: string = '';

  isValid: boolean = false;
  passwordMatch: boolean = false;
  emailValid: boolean = false;

  constructor(
    private alertController: AlertController,
    private router: Router,
    private authService: AuthService 
  ) {}

  validateForm() {
    const noSpaces = !this.mail.includes(' ') && !this.user.includes(' ') && !this.password.includes(' ') && !this.confirmPassword.includes(' ');
    this.emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.mail);
    this.passwordMatch = this.password === this.confirmPassword;
    const allFieldsFilled = this.mail !== '' && this.fullName !== '' && this.user !== '' && this.password !== '' && this.confirmPassword !== '' && this.birthDate !== '';
    this.isValid = noSpaces && this.emailValid && this.passwordMatch && allFieldsFilled;
  }

  convertToLowercase() {
    this.user = this.user.toLowerCase();
  }

  saveRegister() {
    this.fullName = this.fullName.toUpperCase();

    const registro = {
      mail: this.mail,
      fullName: this.fullName,
      user: this.user,
      password: this.password,
      birthDate: this.birthDate,
    };

    // Guarda el registro usando el servicio
    this.authService.register(registro);

    this.showAlert('Registro exitoso', 'El registro se ha guardado correctamente.');
    this.clearForm();
  }

  clearForm() {
    this.mail = '';
    this.fullName = '';
    this.user = '';
    this.password = '';
    this.confirmPassword = '';
    this.birthDate = '';
    this.isValid = false;
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
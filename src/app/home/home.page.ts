import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class HomePage {
  mail: string = '';
  fullName: string = '';
  user: string = '';
  password: string = '';
  confirmPassword: string = '';
  birthDate: string = '';

  registros: any[] = [];
  isValid: boolean = false;
  passwordMatch: boolean = false;
  emailValid: boolean = false;

  constructor(private alertController: AlertController) {}

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

    this.registros.push(registro);
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
}
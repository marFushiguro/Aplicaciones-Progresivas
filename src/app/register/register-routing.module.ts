import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterPage } from './register.page'; // Importa RegisterPage directamente

const routes: Routes = [
  {
    path: '',
    component: RegisterPage, // Usa RegisterPage directamente
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterPageRoutingModule {}
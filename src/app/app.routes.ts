import { Routes } from '@angular/router';
import { HomePage } from './home/home.page';
import { LoginPage } from './login/login.page';
import { RegisterPage } from './register/register.page';
import { ProfilePage } from './profile/profile.page';
import { AdminUsersPage } from './admin-users/admin-users.page';
import { CreateUserPage } from 'src/app/create-user/create-user.page';
//import { AddUserPage } from './add-user/add-user.page';
import { EditUserPage } from './edit-user/edit-user.page'; 
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component: HomePage },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: 'profile', component: ProfilePage, canActivate: [AuthGuard] },
  { path: 'admin-users', component: AdminUsersPage, canActivate: [AuthGuard] }, // Ruta protegida
  { path: 'create-user', component: CreateUserPage, canActivate: [AuthGuard] },
  { path: 'edit-user/:uid', component: EditUserPage, canActivate: [AuthGuard] }, // Ruta protegida con parámetro
  { path: '**', redirectTo: 'home' }, // Ruta comodín para manejar rutas no encontradas

];

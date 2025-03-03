import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminUsersPage } from '../admin-users/admin-users.page';
import { CreateUserPage } from 'src/app/create-user/create-user.page';
import { EditUserPage } from '../edit-user/edit-user.page';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminUsersPage,
  },
  {
    path: 'create',
    component: CreateUserPage,
  },
  {
    path: 'edit/:uid',
    component: EditUserPage,
  },
  {
    path: '',
    redirectTo: '/admin',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
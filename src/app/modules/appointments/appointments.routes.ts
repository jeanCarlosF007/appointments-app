import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { rolesGuard } from '../../core/guards/roles.guard';
import { UserRoles } from '../auth/constants/user-roles.enum';
import { CreateComponent } from './components/create/create.component';
import { ListComponent } from './components/list/list.component';
import { AppointmentsComponent } from './appointments.component';
import { CancelComponent } from './components/cancel/cancel.component';
import { DoneComponent } from './components/done/done.component';

export const appointmentsRoutes: Routes = [
  {
    path: '',
    component: AppointmentsComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: ListComponent,
        canActivate: [rolesGuard],
        data: { roles: [UserRoles.ADMIN, UserRoles.USER] },
      },
      {
        path: 'create',
        component: CreateComponent,
        canActivate: [rolesGuard],
        data: { roles: [UserRoles.USER] },
      },
      {
        path: 'edit/:id',
        component: CreateComponent,
        canActivate: [rolesGuard],
        data: { roles: [UserRoles.USER] },
      },
      {
        path: 'cancel/:id',
        component: CancelComponent,
        canActivate: [rolesGuard],
        data: { roles: [UserRoles.ADMIN, UserRoles.USER] },
      },
      {
        path: 'done/:id',
        component: DoneComponent,
        canActivate: [rolesGuard],
        data: { roles: [UserRoles.ADMIN] },
      },
    ],
  },
];

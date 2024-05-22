import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { rolesGuard } from '../../core/guards/roles.guard';
import { UserRoles } from '../auth/constants/user-roles.enum';
import { CreateComponent } from './components/create/create.component';
import { ListComponent } from './components/list/list.component';
import { AppointmentsComponent } from './appointments.component';

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
        data: { roles: [UserRoles.ADMIN] },
      },
      {
        path: 'edit/:id',
        component: CreateComponent,
        canActivate: [rolesGuard],
        data: { roles: [UserRoles.ADMIN] },
      },
    ],
  },
];

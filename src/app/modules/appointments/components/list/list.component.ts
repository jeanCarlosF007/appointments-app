import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { Subject, first } from 'rxjs';
import { Appointment } from '../../models/appointment.model';
import { AppointmentsService } from '../../services/appointments.service';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [RouterModule, MatCardModule, MatButtonModule, MatTableModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit, OnDestroy {
  protected ngUnsubscribe = new Subject();

  appointments!: Appointment[];
  userRole!:string;
  status!: string;

  constructor(
    private appointmentsService: AppointmentsService,
    private authService: AuthService,
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAppointments();
  }

  getAppointments(): void {
    this.appointmentsService
      .getAppointments()
      .pipe(first())
      .subscribe({
        // next: (response: Appointment[]) => {
        //   this.appointments = response;
        // },
        next: (response: Appointment[]) => {
          this.appointments = response.map(appointment => ({
            ...appointment,
            date: this.formatDate(appointment.date),
            status: this.formatStatus(appointment.status)
          }));
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  editAppointment(id: string): void {
    let status = this.getStatus(id);

    if (status === 'DONE' || status === 'CANCELED') {
      alert('Você não pode editar uma consulta que tenha sido cancelada ou concluída');
      return;    
    }
    this.router.navigate(['appointments', 'edit', id]);
  }

  cancelAppointment(id: string): void {
    const status = this.getStatus(id);
    const role = this.getRole();
    if (status === 'DONE') {
      alert('Você não pode cancelar uma consulta que já tenha sido concluída!');
      return;
    }
    if (status === 'CANCELED') {
      alert('Esta consulta já foi cancelada');
      return;
    }

    this.router.navigate(['appointments', 'cancel', id]);
  }

  concludeAppointment(id: string): void {
    const status = this.getStatus(id);
    const role = this.getRole();
    
    if (role === 'USER') {
      alert("Você não tem permissão para marcar consultas como concluídas!");
      return;
    }
    if (status === 'CANCELED') {
      alert('Você não pode concluir uma consulta que tenha sido cancelada');
      return;
    }
    if (status === 'DONE') {
      alert('Esta consulta já foi concluída');
      return;
    }

    this.router.navigate(['appointments', 'done', id]);
  }

  getStatus(id: string): string {
    this.appointmentsService
      .getAppointmentById(id)
      .pipe(first())
      .subscribe({
        next: (appointment) => {
          this.status = appointment.status;
        },
        error: (err) => {
          console.log(err);
        },
      });
    return this.status;
  }

  getRole(): string {
    this.authService.checkUserRoles()
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.userRole = res;
        },
        error: (err) => {
          console.log(err);
        }
      });
    return this.userRole;
  }
  
  formatDate(date: string): string {
    const providedDate = new Date(date);
    const dateOnly = providedDate.toLocaleDateString('pt-BR');
    return dateOnly;
  }

  formatStatus(status: string): string {
    switch (status) {
      case 'SCHEDULED':
        return 'AGENDADO';
      case 'DONE':
        return 'CONCLUÍDO';
      case 'CANCELED':
        return 'CANCELADO';
      default:
        return status;
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

  displayedColumns: string[] = ['specialty', 'doctor', 'date', 'time', 'status', 'obs', 'edit'];
  dataSource = this.appointments;

}

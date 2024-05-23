import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { Subject, first } from 'rxjs';
import { ConfirmationModalComponent } from '../../../../commons/components/confirmation-modal/confirmation-modal.component';
import { Appointment } from '../../models/appointment.model';
import { AppointmentsService } from '../../services/appointments.service';
import { MatTableModule } from '@angular/material/table';

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

  constructor(
    private appointmentsService: AppointmentsService,
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

  onDelete(id: string): void {
    this.appointmentsService
      .deleteAppointment(id)
      .pipe(first())
      .subscribe({
        complete: () => {
          this.getAppointments();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  openDialog(id: string): void {
    const dialog = this.dialog.open(ConfirmationModalComponent, {
      width: '250px',
      disableClose: true,
      data: {
        id,
      },
    });

    dialog
      .afterClosed()
      .pipe(first())
      .subscribe((res) => {
        if (res) {
          this.onDelete(id);
        }
      });
  }

  editAppointment(id: string): void {
    if (this.appointments[parseInt(id)].status === 'CANCELADO' || this.appointments[parseInt(id)].status === 'CONCLUÍDO') {
      alert('Você não pode editar uma consulta que tenha sido cancelada ou já tenha sido concluída!');
      return;
    }
    this.router.navigate(['appointments', 'edit', id]);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
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

  displayedColumns: string[] = ['specialty', 'doctor', 'date', 'time', 'status', 'obs', 'edit'];
  dataSource = this.appointments;

}

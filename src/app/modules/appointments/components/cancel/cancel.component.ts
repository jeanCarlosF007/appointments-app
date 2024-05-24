import { Component } from '@angular/core';
import { AppointmentsService } from '../../services/appointments.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { first } from 'rxjs';
import { Appointment } from '../../models/appointment.model';

@Component({
  selector: 'app-cancel',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './cancel.component.html',
  styleUrl: './cancel.component.scss'
})
export class CancelComponent {
  id?: string;

  constructor(
    private appointmentsService: AppointmentsService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    this.id = this.route.snapshot.params['id'];

    if (this.id) {
      this.appointmentsService.getAppointmentById(this.id)
        .pipe(first())
        .subscribe({
          next: (appointment) => {
            const editedAppointment = appointment;
            editedAppointment.status = 'CANCELED';
            this.updateAppointment(editedAppointment);
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }

  updateAppointment(appointment: Appointment): void {
    this.appointmentsService
      .updateAppointment(this.id as string, appointment)
      .pipe(first())
      .subscribe({
        complete: () => {
          this.router.navigate(['appointments']);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

}

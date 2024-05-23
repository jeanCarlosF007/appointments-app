import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormControlState,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { first } from 'rxjs';
import { Appointment } from '../../models/appointment.model';
import { AppointmentsService } from '../../services/appointments.service';
import { status } from '../../models/status.model';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateComponent implements OnInit {
  form!: FormGroup;

  id?: string;

  constructor(
    private appointmentsService: AppointmentsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.buildForm();

    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.getAppointment(this.id);
    }
  }

  buildForm(): void {
    this.form = new FormGroup({
      specialty: new FormControl(null, [Validators.required]),
      doctor: new FormControl(null, [Validators.required]),
      date: new FormControl(null, [Validators.required]),
      time: new FormControl(null, [Validators.required]),
      status: new FormControl(status.SCHEDULED, [Validators.required]),
      obs: new FormControl(null, [Validators.required])
    });
  }

  getAppointment(id: string): void {
    this.appointmentsService
      .getAppointmentById(id)
      .pipe(first())
      .subscribe({
        next: (appointment) => {
          this.form.patchValue(appointment);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  onSave(): void {
    const appointment: Appointment = this.form.getRawValue();
    if (this.id) {
      this.updateAppointment(appointment);
      return;
    }
    this.createAppointment(appointment);
  }

  createAppointment(appointment: Appointment): void {
    this.appointmentsService
      .saveAppointment(appointment)
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

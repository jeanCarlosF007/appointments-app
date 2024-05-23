import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Appointment } from '../models/appointment.model';

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  apiUrl = `${environment.API_URL}/appointments`;

  constructor(private http: HttpClient) { }

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl);
  }

  getAppointmentById(id: string): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`);
  }

  saveAppointment(Appointment: Appointment): Observable<void> {
    return this.http.post<void>(this.apiUrl, Appointment);
  }

  updateAppointment(id: string, Appointment: Appointment): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, Appointment);
  }

  deleteAppointment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

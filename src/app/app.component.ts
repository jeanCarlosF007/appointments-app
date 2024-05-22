import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './commons/components/header/header.component';
import { LoadingService } from './commons/services/loading.service';
import { AppointmentsComponent } from './modules/appointments/appointments.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    AppointmentsComponent,
    HeaderComponent,
    MatProgressSpinnerModule,
    NgIf,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'loja';

  isLoading = false;

  constructor(private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.loadingService.isLoading$.subscribe((res) => {
      this.isLoading = res;
    });
  }
}

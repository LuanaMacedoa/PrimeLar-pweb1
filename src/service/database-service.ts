import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class DatabaseService {
  readonly http = inject(HttpClient);
  readonly apiUrl = environment.apiUrl;
}

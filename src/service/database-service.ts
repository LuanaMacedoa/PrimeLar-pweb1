import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private readonly apiUrl = 'https://gwwzahbscsijbehvxlgz.supabase.co/rest/v1/';
  private readonly apiKey = 'sb_publishable_mX-d5Z2qs5uApfiUBUxjGg_pLrJw11H';
}

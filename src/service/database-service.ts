import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private readonly apiUrl = 'https://gwwzahbscsijbehvxlgz.supabase.co';
  private readonly apiKey = 'sb_publishable_mX-d5Z2qs5uApfiUBUxjGg_pLrJw11H';

  public supabase: SupabaseClient = createClient(
    this.apiUrl,
    this.apiKey
  );
}

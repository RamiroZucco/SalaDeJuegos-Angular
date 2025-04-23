import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  supabase: SupabaseClient<any, "public", any>;
  
  constructor() { 

    this.supabase = createClient(
      "https://jrabrtadcsxqgehpnrwk.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyYWJydGFkY3N4cWdlaHBucndrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNjI5NTQsImV4cCI6MjA2MDgzODk1NH0.Q2CGOlRPbKuA-oOKAeq6poJsBpcMjolO39h1sBFP_1w"
    );
  }
}
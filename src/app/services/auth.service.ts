import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { User } from '@supabase/supabase-js';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  sb = inject(SupabaseService);
  router = inject(Router);

  usuarioActual: User | null = null;

  constructor() { 
    this.sb.supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session);

      if(session === null) { 
        this.usuarioActual = null;
      } else { 
        this.usuarioActual = session.user;
        this.router.navigateByUrl("/");
      }
    });
  }


  async crearCuenta(correo: string, contraseña: string){
      return await this.sb.supabase.auth.signUp({
      email: correo,
      password: contraseña 
    });
  }
  
  async iniciarSesion(correo: string, contraseña: string) {
    return await this.sb.supabase.auth.signInWithPassword({
      email: correo,
      password: contraseña 
    });
  }
  
  async cerrarSesion(){
    const { error} = await this.sb.supabase.auth.signOut();
    this.router.navigateByUrl("/login");
  }

  async insertarUsuario(profile: { id_usuario: string; email: string; nombre: string; apellido: string; edad: number | null }) {
    const { data, error } = await this.sb.supabase.from('usuarios').insert([profile]);
    return { data, error };
  }

  isLoggedIn(): boolean {
  return this.usuarioActual !== null;
  }

}

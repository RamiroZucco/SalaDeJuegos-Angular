import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  mensajes: any[] = [];
  nuevoMensaje: string = '';
  channel: any;

  constructor(public auth: AuthService, private router: Router) {}

  async ngOnInit() {
    await this.cargarMensajes();

    this.channel = this.auth.sb.supabase
      .channel('public:chat')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat' },
        (payload) => {
          this.mensajes.push(payload.new);
          this.scrollToBottom();
        }
      )
      .subscribe((status: string) => {
        if (status === 'SUBSCRIBED') {
          console.log('Suscripción al canal de chat activa.');
        }
      });
  }

  ngOnDestroy() {
    if (this.channel) {
      this.auth.sb.supabase.removeChannel(this.channel);
    }
  }

  async cargarMensajes() {
    const { data, error } = await this.auth.sb.supabase
      .from('chat')
      .select('*')
      .order('fecha', { ascending: true });

    if (!error) {
      this.mensajes = data;
    } else {
      console.error('Error al cargar mensajes:', error.message);
    }
  }

  async enviarMensaje() {
    if (this.nuevoMensaje.trim() === '') return;
  
    const nuevo = {
      id_usuario: this.auth.usuarioActual?.id,
      email_usuario: this.auth.usuarioActual?.email,
      mensaje: this.nuevoMensaje,
      fecha: new Date()
    };
  
    const { error } = await this.auth.sb.supabase.from('chat').insert([nuevo]);
  
    if (!error) {
      this.nuevoMensaje = '';
    } else {
      console.error('Error al enviar mensaje:', error.message);
    }
  }
  

  esMensajePropio(email: string) {
    return email === this.auth.usuarioActual?.email;
  }

  scrollToBottom() {
    setTimeout(() => {
      const contenedor = document.querySelector('.chat-mensajes');
      if (contenedor) {
        contenedor.scrollTop = contenedor.scrollHeight;
      }
    }, 100);
  }
}


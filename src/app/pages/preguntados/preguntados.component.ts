import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ApiRequestPreguntadosService } from '../../services/api-request-preguntados.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preguntados',
  templateUrl: './preguntados.component.html',
  styleUrls: ['./preguntados.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PreguntadosComponent implements OnInit, OnDestroy {
  constructor(private router: Router) {}
  requester = inject(ApiRequestPreguntadosService);
  auth = inject(AuthService);

  juegoIniciado: boolean = false;

  suscripcion: Subscription | null = null;
  suscripcionImg: Subscription | null = null;

  rtaCorrectaActual: string = '';
  preguntaActual: string = '';
  opcA: string = '';
  opcB: string = '';
  opcC: string = '';
  opcD: string = '';

  img_actual: string = '';
  intentos: number = 5;
  puntaje: number = 0;

  showModal: boolean = false;
  modalTitulo: string = '';
  modalMensaje: string = '';
  esFinal: boolean = false;

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnDestroy(): void {
    this.suscripcion?.unsubscribe();
    this.suscripcionImg?.unsubscribe();
  }

  comenzarJuego() {
    this.mostrarSpinner();
    this.juegoIniciado = true;
    this.puntaje = 0;
    this.intentos = 5;
    this.preguntaNueva();
  }
  preguntaNueva() {
    this.requester.categoria_actual = Math.floor(Math.random() * this.requester.categorias.length);
    this.requester.pagina_actual = String(Math.floor(Math.random() * 10) + 1);

    this.suscripcion = this.requester.traerPregunta().subscribe({
      next: (rta: any) => {
        const data = rta.questions[0];
        this.rtaCorrectaActual = data.correctAnswers;
        this.preguntaActual = data.question;

        let opciones = [
          data.correctAnswers,
          data.incorrectAnswers[0],
          data.incorrectAnswers[1],
          data.incorrectAnswers[2],
        ];

        this.Shuffle(opciones);
        this.AsignarOpciones(opciones);
        this.imagenNueva();
        this.ocultarSpinner();
      }
    });
  }

  imagenNueva() {
    this.suscripcionImg = this.requester.traerImagenSobrePregunta().subscribe({
      next: (rta: any) => {
        let indice = Math.floor(Math.random() * 10);
        this.img_actual = rta.results[indice].urls.small;
      }
    });
  }

  AsignarOpciones(array: string[]) {
    this.opcA = array[0];
    this.opcB = array[1];
    this.opcC = array[2];
    this.opcD = array[3];
  }

  Shuffle(array: string[]): string[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  IntentoPregunta(letra: string) {
    let elegida = '';
    if (letra === 'A') elegida = this.opcA;
    if (letra === 'B') elegida = this.opcB;
    if (letra === 'C') elegida = this.opcC;
    if (letra === 'D') elegida = this.opcD;

    const esCorrecta = elegida === this.rtaCorrectaActual;

    if (esCorrecta) {
      this.puntaje++;
      this.mostrarModal("¡Correcto!", "¡Sumás un punto!");
    } else {
      this.intentos--;

      if (this.intentos <= 0) {
        this.mostrarModal("Juego terminado", `Tu puntaje fue: ${this.puntaje}`, true);
        this.guardarResultado();
        return;
      } else {
        const mensaje = `La respuesta correcta era: ${this.rtaCorrectaActual}`;
        this.mostrarModal("Respuesta incorrecta", mensaje);
      }
    }
  }

  mostrarModal(titulo: string, mensaje: string, final: boolean = false) {
    this.modalTitulo = titulo;
    this.modalMensaje = mensaje;
    this.esFinal = final;
    this.showModal = true;
  }

  cerrarModal() {
    this.showModal = false;
    if (!this.esFinal) {
      this.mostrarSpinner();
      setTimeout(() => {
        this.preguntaNueva();
      }, 100); 
    } else {
      this.router.navigate(['/home']);
    }
  }

  async guardarResultado() {
    const { error } = await this.auth.sb.supabase
      .from('preguntados_resultados')
      .insert([{
        usuario: this.auth.usuarioActual?.email,
        puntaje: this.puntaje,
        categoria: this.requester.categorias[this.requester.categoria_actual],
        dificultad: "N/A"
      }]);

    if (error) {
      console.error("Error al guardar resultado de Preguntados:", error.message);
    }
  }

  mostrarSpinner() {
    const spinner = document.createElement('div');
    spinner.id = 'spinner';
    spinner.style.position = 'fixed';
    spinner.style.top = '0';
    spinner.style.left = '0';
    spinner.style.width = '100%';
    spinner.style.height = '100%';
    spinner.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    spinner.style.display = 'flex';
    spinner.style.alignItems = 'center';
    spinner.style.justifyContent = 'center';
    spinner.style.color = 'white';
    spinner.style.fontSize = '24px';
    spinner.style.zIndex = '1000';

    const texto = document.createElement('div');
    texto.textContent = 'Cargando...';
    spinner.appendChild(texto);

    document.body.appendChild(spinner);
  }

  ocultarSpinner() {
    const spinner = document.getElementById('spinner');
    if (spinner) {
      spinner.remove();
    }
  }
}
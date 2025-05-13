import { Component } from '@angular/core';
import { NgIf, CommonModule } from '@angular/common';  
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [CommonModule,FontAwesomeModule],  
  templateUrl: './ahorcado.component.html',
  styleUrls: ['./ahorcado.component.css']
})
export class AhorcadoComponent {
  palabras: string[] = [
  "HELADERA", "ESCOBA", "MICROONDAS", "SARTEN", "ZAPATILLA", "ALMOHADA", "ABRIGO",
  "SANDALIA", "CUCHARA", "LAPICERA", "REGLA", "TIJERA", "LINTERNA", "BATERIA", 
  "FOTOCOPIA", "CASCADA", "CANGURO", "GATO", "PEINE", "TARJETA", "ESPEJOS", 
  "RELOJ", "CAMINAR", "PASTO", "ESCALERA", "CASCO", "CAJA", "SILLA", "MESA",
  "BOTELLA", "VASO", "VENTILADOR", "CARGADOR", "PUERTA", "CAMA", "VASO",
  "PLATO", "TOALLA", "VALIJA", "PERRO", "MERCADO", "PULSERA", "GORRO",
  "COMPUTADOR", "COCINA", "ARMARIO", "PLANCHA", "JUGUETE"
  ];
  wordSelected: string = '';
  wordUser: string[] = [];
  vidas: number = 6;
  lose: boolean = false;
  gameOver: boolean = false;

  letrasSeleccionadas: string[] = [];
  tiempoInicio!: number;
  tiempoFinal!: number;
  faHeart = faHeart;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.wordSelected = this.getWord();
    this.initializeWordUser();
    this.tiempoInicio = Date.now();
  }

  getLetter(letter: string, event: MouseEvent) {
    if (this.gameOver) return;

    this.letrasSeleccionadas.push(letter);
    this.tryLetterInWord(letter, this.wordSelected);

    const buttonElement = event.target as HTMLButtonElement;
    buttonElement.setAttribute('disabled', '');

    if (this.gameFinished()) {
      this.finalizarJuego(true);
    } else if (this.vidas === 0) {
      this.finalizarJuego(false);
    }
  }

  finalizarJuego(gano: boolean) {
    this.gameOver = true;
    this.lose = !gano;
    this.tiempoFinal = Date.now();
    this.guardarResultado(gano);
  }

  async guardarResultado(gano: boolean) {
    const tiempoTotalSegundos = Math.floor((this.tiempoFinal - this.tiempoInicio) / 1000);

    const datos = {
      id_usuario: this.authService.usuarioActual?.id || '',
      tiempo: tiempoTotalSegundos,
      letras_seleccionadas: this.letrasSeleccionadas.length,
      resultado: gano ? 'Victoria' : 'Derrota',
      fecha: new Date()
    };

    const { data, error } = await this.authService.sb.supabase
      .from('resultados_ahorcado') 
      .insert([datos]);

    if (error) {
      console.error('Error al guardar resultados', error.message);
    } else {
      console.log('Resultado guardado correctamente.');
    }
  }

  resetButtons() {
    const row1 = document.querySelectorAll('.row-1 button');
    const row2 = document.querySelectorAll('.row-2 button');
    const row3 = document.querySelectorAll('.row-3 button');

    row1.forEach((button) => button.removeAttribute('disabled'));
    row2.forEach((button) => button.removeAttribute('disabled'));
    row3.forEach((button) => button.removeAttribute('disabled'));
  }

  getWord() {
    let word = this.palabras[Math.floor(Math.random() * this.palabras.length)];
    return word;
  }

  initializeWordUser() {
    for (let i = 0; i < this.wordSelected.length; i++) {
      this.wordUser[i] = '_';
    }
  }

  isLetterInWord(letter: string, word: string) {
    return word.includes(letter);
  }

  tryLetterInWord(letter: string, word: string) {
    let found = false;
    for (let i = 0; i < word.length; i++) {
      if (word[i] === letter) {
        found = true;
        this.wordUser[i] = letter;
      }
    }
    if (!found) {
      this.vidas--;
    }
  }

  gameFinished() {
    return this.wordUser.join('') === this.wordSelected;
  }

  resetGame() {
    this.wordSelected = this.getWord();
    this.wordUser = [];
    this.vidas = 6;
    this.lose = false;
    this.gameOver = false;
    this.letrasSeleccionadas = [];
    this.initializeWordUser();
    this.resetButtons();
    this.tiempoInicio = Date.now();
  }

  getLifesArray() {
    return new Array(this.vidas);
  }
  
  getNotLifesArray() {
    return new Array(6 - this.vidas);
  }
}

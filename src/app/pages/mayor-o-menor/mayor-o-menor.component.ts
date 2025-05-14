import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mayor-o-menor',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, HttpClientModule],
  templateUrl: './mayor-o-menor.component.html',
  styleUrls: ['./mayor-o-menor.component.css']
})
export class MayorOMenorComponent implements OnInit {
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  deckId: string | null = null; 
  actualCard: any = null;
  prevCardValue: string = '';
  gameStarted: boolean = false;
  valoresOrdenados: string[] = ['ACE', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'JACK', 'QUEEN', 'KING'];
  puntuacion: number = 0;

  stillPlay: boolean = true;
  gameOver: boolean = false;

  faArrowDown = faArrowDown;
  faArrowUp = faArrowUp;

  constructor(private http: HttpClient, private auth: AuthService, private router: Router) {}

  getCard(action: string) {    
    if(action === 'start') {
      this.http.get<any>('https://deckofcardsapi.com/api/deck/new/draw/?count=1')
        .subscribe((data: any) => {
          this.gameStarted = true;
          this.deckId = data.deck_id;
          this.actualCard = data.cards[0];
        });
    } else {
      this.http.get<any>(`https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=1`)
        .subscribe((data: any) => {
          this.prevCardValue = this.actualCard.value;
          this.actualCard = data.cards[0];
          if(action === 'up') {
            this.isHigher();
          } else {
            this.isLower();
          }
        });
    }
  }

  isHigher() {
    if(this.valoresOrdenados.indexOf(this.actualCard.value) >= this.valoresOrdenados.indexOf(this.prevCardValue)) {
      this.puntuacion++;
    } else {
      this.finishGame();
    }
  }

  isLower() {
    if(this.valoresOrdenados.indexOf(this.actualCard.value) <= this.valoresOrdenados.indexOf(this.prevCardValue)) {
      this.puntuacion++;
    } else {
      this.finishGame();
    }
  }

  finishGame() {
    this.stillPlay = false;
    this.gameOver = true;
    this.saveResult();
  }

  resetGame() {
    this.deckId = null;
    this.actualCard = null;
    this.prevCardValue = '';
    this.gameStarted = false;
    this.stillPlay = true;
    this.gameOver = false;
    this.puntuacion = 0;
  }

  async saveResult() {
    const datos = {
      usuario: this.auth.usuarioActual?.email || '',
      aciertos: this.puntuacion,
      fecha: new Date()
    };

    const { error } = await this.auth.sb.supabase
      .from('resultados_mayoromenor')
      .insert([datos]);

    if (error) {
      console.error('Error al guardar resultado:', error.message);
    } else {
      console.log('Resultado guardado correctamente.');
    }
  }
}

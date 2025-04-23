import { Component } from '@angular/core';
import { GithubService } from '../../services/github.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-quiensoy',
  imports: [CommonModule],
  templateUrl: './quiensoy.component.html',
  styleUrl: './quiensoy.component.css'
})
export class QuiensoyComponent {
  githubUser: any;
  username = 'RamiroZucco'; 

  constructor(private githubService: GithubService) {}

  ngOnInit(): void {
    this.githubService.getUserData(this.username).subscribe(data => {
      this.githubUser = data;
    });
  }

}

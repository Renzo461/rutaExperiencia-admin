import { Component } from '@angular/core';

@Component({
  selector: 'app-ciclos',
  templateUrl: './ciclos.component.html',
  styleUrls: ['./ciclos.component.css']
})
export class CiclosComponent {
  
  ciclos: number = 10
  arrayCiclos: number[] = Array(this.ciclos).fill(0).map((x, i) => i + 1);


  gridCiclos() {
    return {
      'display': 'grid',
      'grid-template-rows': '70px',
      'grid-template-columns': `repeat(${this.ciclos},1fr)`,
      'gap': '20px',
    }
  }
}

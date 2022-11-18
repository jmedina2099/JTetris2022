import { Component, Input } from '@angular/core';

import { Caja } from '../app.component'

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.css']
})
export class BoxComponent {

  @Input() caja: Caja | undefined;

}

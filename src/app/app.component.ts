import { Component } from '@angular/core';
import { SvgIconService } from './svg-icon/svg-icon.service';
import * as forEach from 'lodash/forEach';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private icons = [
    ['file', 'assets/icons/file.svg'],
    ['arrow-round', 'assets/icons/arrow-round.svg'],
    ['expand-arrow', 'assets/icons/expand-arrow.svg'],
    ['beach-ball', 'assets/icons/beach-ball.svg']
  ];

  constructor(
    private svgIconService: SvgIconService
  ) {
    forEach(this.icons, icon => {
      svgIconService.registerIcon(icon);
    });
  }

}

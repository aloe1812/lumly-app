import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {

  constructor() { }

  calculateMenuPosition(data: {
    eventX: number,
    eventY: number,
    menuWidth: number,
    menuHeight: number
  }): {
    x: number,
    y: number
  } {
    const result = {
      x: data.eventX,
      y: data.eventY
    };

    if ( (data.eventY + data.menuHeight) > document.body.offsetHeight ) {
      result.y = document.body.offsetHeight -  data.menuHeight;
    }

    return result;
  }

}

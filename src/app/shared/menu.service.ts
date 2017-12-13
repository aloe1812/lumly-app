import { Injectable } from '@angular/core';
import { InjectionService } from '../core/injection.service';
import { MenuComponent } from './menu/menu.component';

@Injectable()
export class MenuService {

  constructor(
    private injector: InjectionService
  ) { }

  openMenu(options) {
    return this.injector.appendComponent(MenuComponent, options).instance.destroy.first();
  }

}

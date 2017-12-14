import { Injectable } from '@angular/core';
import { InjectionService } from '../core/injection.service';
import { MenuComponent } from './menu/menu.component';
import { ConfirmDeleteComponent } from './confirm-delete/confirm-delete.component';

@Injectable()
export class SharedUiUtilsService {

  constructor(
    private injector: InjectionService
  ) { }

  openMenu(options) {
    return this.injector.appendComponent(MenuComponent, options).instance.destroy.first();
  }

  confirmDelete(options) {
    return this.injector.appendComponent(ConfirmDeleteComponent, options).instance.destroy.first();
  }

}

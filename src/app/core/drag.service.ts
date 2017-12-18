import { Injectable } from '@angular/core';
import * as dragula from 'dragula';
import * as remove from 'lodash/remove';

@Injectable()
export class DragService {

  private store = {};
  private drake;
  private rootComponent;

  constructor() { }

  init(rootComponent) {
    this.rootComponent = rootComponent;

    const rootElem = rootComponent.elementRef.nativeElement.querySelector('.dragula');
    // предназначен для того, чтобы можно было положить файл в корень если навести на самый верх
    const fakeDrop = rootComponent.elementRef.nativeElement.querySelector('.fake-drop');

    this.drake = dragula([rootElem, fakeDrop], {
      copy: true
    });

    this.drake.on('drag', el => {
      fakeDrop.classList.add('shown');

      // скрываем подэлементы если перетаскиваем группу
      if (el.classList.contains('is-group')) {
        const guid = el.parentElement.dataset.guid;
        this.store[guid].component.file.isToggled = false;
      }
    });

    this.drake.on('over', (el, container, source) => {
      if (container === fakeDrop) {
        container = rootElem;
      }

      // у групп источник на самом деле находиться элементом выше
      // из-за того что сама группа находиться в своем групповом контейнере
      if (el.classList.contains('is-group')) {
        if (el.dataset.guid === container.dataset.guid) {
          container = container.parentElement.parentElement;
        }
        source = source.parentElement.parentElement;
      }

      if (container === source) {
        return;
      }

      // визуально выделяем группу в которую собираемся кинуть файл
      if (container !== source) {
        container.classList.add('dragover');
      }

      // Раскрываем группу если навели на нее
      if (container.tagName === 'APP-FILE') {
        const containerGuid = container.dataset.guid;
        if ( containerGuid && this.store[containerGuid].isContainer && !this.store[containerGuid].component.file.isToggled ) {
          this.store[containerGuid].component.file.isToggled = true;
        }
      }
    });

    this.drake.on('out', (el, container, source) => {
      if (container === fakeDrop) {
        container = rootElem;
      }

      // убираем визуально оформление
      container.classList.remove('dragover');
    });

    this.drake.on('drop', (el, target, source, sibling) => {
      if (target === fakeDrop) {
        target = rootElem;
      }

      // Файл не был перемещен -> завершаем выполнение
      if (!el.parentElement) {
        return;
      }

      const elemGuid = this.getGuidByElement(el);

      // фиксим контейнер-источник группы
      if (this.store[elemGuid].component.isGroup) {
        source = source.parentElement.parentElement;
      }

      // элемент кинули туда же где он и был -> завершаем выполение
      if (target === source) {
        el.parentElement.removeChild(el);
        return;
      }

      const file = this.store[elemGuid].component.file;

      this.deleteElementFromStore(elemGuid);

      // Предотвращаем копирование узла элемента в target
      el.parentElement.removeChild(el);

      const targetFiles = this.getFilesByElement(target);
      const sourceFiles = this.getFilesByElement(source);

      file._checkPosition = true;

      // удаляем файл из прошлого контейнера и добавляем в новый
      remove(sourceFiles, file);
      targetFiles.push(file);
    });

    this.drake.on('dragend', () => {
      fakeDrop.classList.remove('shown');
    });
  }

  addFile(componentRef) {
    const guid = componentRef.file.guid;

    componentRef.elementRef.nativeElement.dataset.guid = guid;
    componentRef.elementRef.nativeElement.firstChild.dataset.guid = guid;

    this.store[guid] = {
      container: componentRef.elementRef.nativeElement,
      component: componentRef
    };

    if (componentRef.isGroup) {
      this.drake.containers.push(componentRef.elementRef.nativeElement);
      this.store[guid].isContainer = true;
    }
  }

  private getGuidByElement(el) {
    let elemGuid;

    if (el.classList.contains('is-group')) {
      elemGuid = el.dataset.guid;
    } else {
      elemGuid = el.firstChild.dataset.guid;
    }

    return elemGuid;
  }

  private deleteElementFromStore(guid) {
    if (this.store[guid].isContainer) {
      remove(this.drake.containers, this.store[guid].container);
    }

    delete this.store[guid];
  }

  private getFilesByElement(element) {
    let files;

    if (element.classList.contains('dragula')) {
      files = this.rootComponent.files;
    } else {
      files = this.store[element.dataset.guid].component.files;
    }

    return files;
  }

}

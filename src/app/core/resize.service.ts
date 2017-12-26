import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ElectronService } from 'app/core/electron.service';
import * as clone from 'lodash/clone';

@Injectable()
export class ResizeService {

  optimizedResize = (function() {
    const callbacks = [];
    let running = false;

    // fired on resize event
    function resize() {
      if (!running) {
        running = true;

        if (window.requestAnimationFrame) {
          window.requestAnimationFrame(runCallbacks);
        } else {
          setTimeout(runCallbacks, 66);
        }
      }
    }

    // run the actual callbacks
    function runCallbacks() {
      callbacks.forEach(function(callback) {
        callback();
      });

      running = false;
    }

    // adds callback to loop
    function addCallback(callback) {
      if (callback) {
        callbacks.push(callback);
      }
    }

    return {
      // public method to add additional callback
      add: (callback) => {
        if (!callbacks.length) {
          window.addEventListener('resize', resize);
        }
        addCallback(callback);
      }
    }
  }());

  private isSidebarOpen = true;

  private onSidebarToggleSub = new BehaviorSubject(true);
  onSidebarToggle = this.onSidebarToggleSub.asObservable();

  private containers;

  private defaultSizes = {
    sidebar: 250,
    workspaceProportion: 0.5
  };

  private sizes = {
    sidebar: 250,
    workspaceProportion: 0.5
  };

  private workspaceResizer: any  = {
    min: 130,
    dragging: false
  };

  private sidebarResizer: any  = {
    min: 120,
    margin: 40,
    dragging: false
  };

  constructor(
    private electronService: ElectronService
  ) {
    this.subscribeToElectronEvents();
  }

  init(rootElement) {
    this.containers = {
      sidebar: rootElement.querySelector('.sidebar'),
      workspace: rootElement.querySelector('.workspace'),
      editor: rootElement.querySelector('.editor'),
      diagram: rootElement.querySelector('.diagram')
    }

    this.containers.sidebar.style.width = `${this.sizes.sidebar}px`;

    this.optimizedResize.add(this.onWindowResize.bind(this));
  }

  showSidebar() {
    this.isSidebarOpen = true;
    this.containers.sidebar.style.width = `${this.sizes.sidebar}px`;
    this.fixWorkspace();
    this.onSidebarToggleSub.next(this.isSidebarOpen);
  }

  hideSidebar() {
    this.isSidebarOpen = false;
    this.containers.sidebar.style.width = 0;
    this.fixWorkspace();
    this.onSidebarToggleSub.next(this.isSidebarOpen);
  }

  initWorkspaceResizer() {
    this.workspaceResizer.element = this.containers.editor.querySelector('.resizer-trigger');

    this.workspaceResizer.element.addEventListener('mousedown', (ev) => {
      this.workspaceResizer.dragging = true;
      this.workspaceResizer.startLeft = this.containers.editor.offsetLeft;
      this.workspaceResizer.workspaceWidth = this.containers.workspace.offsetWidth;
      document.body.classList.add('is-dragging');
      this.workspaceResizer.offset = this.workspaceResizer.startLeft + this.workspaceResizer.element.offsetLeft - ev.x + 2;
    });

    document.addEventListener('mouseup', () => {
      if (this.workspaceResizer.dragging) {
        document.body.classList.remove('is-dragging');
        this.workspaceResizer.dragging = false;
      }
    });

    document.addEventListener('mousemove', (event) => {
      if (!this.workspaceResizer.dragging) {
        return;
      }

      const resizeFunc = () => {
        let editorNewWidth = event.x - this.workspaceResizer.startLeft + this.workspaceResizer.offset;

        if (editorNewWidth < this.workspaceResizer.min) {
          editorNewWidth = this.workspaceResizer.min;
        }

        let diagramNewWidth = this.workspaceResizer.workspaceWidth - editorNewWidth;

        if (diagramNewWidth < this.workspaceResizer.min) {
          diagramNewWidth = this.workspaceResizer.min;
          editorNewWidth = this.workspaceResizer.workspaceWidth - diagramNewWidth;
        }

        this.sizes.workspaceProportion = editorNewWidth / this.workspaceResizer.workspaceWidth;

        this.containers.editor.style.width = editorNewWidth + 'px';
        this.containers.diagram.style.width = diagramNewWidth + 'px';
      };

      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(() => resizeFunc());
      } else {
        resizeFunc();
      }
    });
  }

  initSidebarResizer() {
    this.sidebarResizer.element = this.containers.sidebar.querySelector('.resizer-trigger');

    this.sidebarResizer.element.addEventListener('mousedown', (ev) => {
      this.sidebarResizer.dragging = true;
      document.body.classList.add('is-dragging');
      this.sidebarResizer.offset = this.sidebarResizer.element.offsetLeft - ev.x + 2;
    });

    document.addEventListener('mouseup', () => {
      if (this.sidebarResizer.dragging) {
        document.body.classList.remove('is-dragging');
        this.sidebarResizer.dragging = false;
      }
    });

    document.addEventListener('mousemove', (event) => {
      if (!this.sidebarResizer.dragging) {
        return;
      }

      const resizeFunc = () => {
        const sidebarNewWidth = event.x + this.sidebarResizer.offset;

        // Прекращаем ресайзинг, если ширина сайдбара больше чем минимально разрешенная ширина рабочей области
        if (sidebarNewWidth > (document.body.offsetWidth - this.workspaceResizer.min * 2)) {
          return;
        }

        // Скрываем сайдбар, если человек продолжает пытаться его уменьшать
        if (sidebarNewWidth < this.sidebarResizer.min) {
          if (sidebarNewWidth < (this.sidebarResizer.min - this.sidebarResizer.margin)) {
            this.hideSidebar();
            return;
          }
          return;
        }

        this.sizes.sidebar = sidebarNewWidth;
        this.containers.sidebar.style.width = sidebarNewWidth + 'px';
        this.fixWorkspace();

        if (!this.isSidebarOpen) {
          this.isSidebarOpen = true;
          this.onSidebarToggleSub.next(this.isSidebarOpen);
        }
      };

      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(() => resizeFunc());
      } else {
        resizeFunc();
      }
    });
  }

  private onWindowResize() {
    const { newEditorWidth, newDiagramWidth } = this.calculateNewWorkspaceValues();

    if (document.body.offsetWidth < (this.containers.sidebar.offsetWidth + newEditorWidth + newDiagramWidth)) {
      this.sizes.sidebar = document.body.offsetWidth - newEditorWidth - newDiagramWidth;
      this.containers.sidebar.style.width = this.sizes.sidebar + 'px';
    }

    this.containers.editor.style.width = newEditorWidth + 'px';
    this.containers.diagram.style.width = newDiagramWidth + 'px';
  }

  //  Метод который пересчитывает ширину редактора и области диаграмм
  private fixWorkspace() {
    const { newEditorWidth, newDiagramWidth } = this.calculateNewWorkspaceValues();

    this.containers.editor.style.width = newEditorWidth + 'px';
    this.containers.diagram.style.width = newDiagramWidth + 'px';
  }

  private calculateNewWorkspaceValues() {
    const workspaceWidth = this.containers.workspace.offsetWidth;

    let newEditorWidth = this.sizes.workspaceProportion * workspaceWidth;

    newEditorWidth = newEditorWidth < this.workspaceResizer.min ? this.workspaceResizer.min : newEditorWidth;

    let newDiagramWidth = workspaceWidth - newEditorWidth;

    if (newDiagramWidth < this.workspaceResizer.min) {
      newDiagramWidth = this.workspaceResizer.min;
      newEditorWidth = workspaceWidth - newDiagramWidth;
      newEditorWidth = newEditorWidth < this.workspaceResizer.min ? this.workspaceResizer.min : newEditorWidth;
    }

    this.sizes.workspaceProportion = newEditorWidth / workspaceWidth;

    return {
      newEditorWidth,
      newDiagramWidth
    }
  }

  private subscribeToElectronEvents() {
    this.electronService.ipcRenderer.on('Restore:Default-Layout', () => {
      if (!this.containers) {
        return;
      }

      this.sizes = clone(this.defaultSizes);
      this.showSidebar();
    });
  }

}

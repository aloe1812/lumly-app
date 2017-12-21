import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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

  private onSidebarToggleSub = new BehaviorSubject(true);
  onSidebarToggle = this.onSidebarToggleSub.asObservable();

  private containers;
  private sizes = {
    sidebar: 250
  }
  private editorResizer;

  constructor() { }

  init(rootElement) {
    this.containers = {
      sidebar: rootElement.querySelector('.sidebar'),
      workspace: rootElement.querySelector('.workspace'),
      editor: rootElement.querySelector('.editor'),
      diagram: rootElement.querySelector('.diagram')
    }

    this.containers.sidebar.style.width = `${this.sizes.sidebar}px`;

    this.optimizedResize.add(this.onResize.bind(this));
  }

  showSidebar() {
    this.containers.sidebar.style.width = `${this.sizes.sidebar}px`;
    this.fixWorkspace();
    this.onSidebarToggleSub.next(true);
  }

  hideSidebar() {
    this.containers.sidebar.style.width = 0;
    this.fixWorkspace();
    this.onSidebarToggleSub.next(false);
  }

  // TODO: добавить requestAnimation (?)
  initEditorResizer(element) {
    this.editorResizer = {
      element: element,
      dragging: false,
      min: 120
    };

    this.editorResizer.element.addEventListener('mousedown', () => {
      this.editorResizer.dragging = true;
      this.editorResizer.startLeft = this.containers.editor.offsetLeft;
      this.editorResizer.workspaceWidth = this.containers.workspace.offsetWidth;
      document.body.style.setProperty('cursor', 'col-resize', 'important');
    });

    document.addEventListener('mouseup', () => {
      if (this.editorResizer.dragging) {
        document.body.style.cursor = '';
        this.editorResizer.dragging = false;
      }
    });

    document.addEventListener('mousemove', (event) => {
      if (!this.editorResizer.dragging) {
        return;
      }

      const resizeFunc = () => {
        const editorNewWidth = event.x - this.editorResizer.startLeft;
        const diagramNewWidth = this.editorResizer.workspaceWidth - editorNewWidth;

        if (editorNewWidth < this.editorResizer.min || diagramNewWidth < this.editorResizer.min) {
          return;
        }

        this.containers.editor.style.width = editorNewWidth + 'px';
        this.containers.diagram.style.width = diagramNewWidth + 'px';
      }

      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(() => resizeFunc());
      } else {
        resizeFunc();
      }
    });
  }

  private onResize() {
    const currentEditorWidth = this.containers.editor.offsetWidth;
    const currentDigramWidth = this.containers.diagram.offsetWidth;
    const proportion = currentEditorWidth / (currentEditorWidth + currentDigramWidth);

    const workspaceWidth = this.containers.workspace.offsetWidth;
    const editorNewWidth = proportion * workspaceWidth;

    this.containers.editor.style.width = editorNewWidth + 'px';
    this.containers.diagram.style.width = workspaceWidth - editorNewWidth + 'px';
  }

  private fixWorkspace() {
    const currentEditorWidth = this.containers.editor.offsetWidth;
    const currentDigramWidth = this.containers.diagram.offsetWidth;
    const proportion = currentEditorWidth / (currentEditorWidth + currentDigramWidth);

    const workspaceWidth = this.containers.workspace.offsetWidth;
    const editorNewWidth = proportion * workspaceWidth;

    this.containers.editor.style.width = editorNewWidth + 'px';
    this.containers.diagram.style.width = workspaceWidth - editorNewWidth + 'px';
  }

}

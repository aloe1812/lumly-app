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
    this.onSidebarToggleSub.next(true);
  }

  hideSidebar() {
    this.containers.sidebar.style.width = 0;
    this.onSidebarToggleSub.next(false);
  }

  private onResize() {

  }

}

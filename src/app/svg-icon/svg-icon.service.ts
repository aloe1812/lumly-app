import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SvgIconService {

  private cache = {};
  private nameSrcStore = {};

  constructor(
    private http: HttpClient
  ) { }

  getIconBySrc(src) {
    if (this.cache[src]) {
      return new Promise(resolve => {
        resolve(this.cache[src].cloneNode(true));
      });
    } else {
      return this.downloadIcon(src);
    }
  }

  getIconByName(iconName) {
    return this.getIconBySrc(this.nameSrcStore[iconName]);
  }

  downloadIcon(src) {
    return new Promise(resolve => {
      this.http.get(src, {
        responseType: 'text'
      })
        .subscribe(
          (svg) => {
            const div = document.createElement('DIV');
            div.innerHTML = svg;
            div.querySelector('svg');
            const svgElement = div.querySelector('svg');

            svgElement.setAttribute('width', '100%');
            svgElement.setAttribute('height', '100%');
            svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');

            this.cache[src] = svgElement;
            resolve(this.cache[src].cloneNode(true));
          },
          () => {
            this.cache[src] = null;
            resolve(null);
          }
        );
    });
  }

  registerIcon(data) {
    this.nameSrcStore[data[0]] = data[1];
    this.downloadIcon(data[1]);
  }

}

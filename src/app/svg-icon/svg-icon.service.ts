import { Injectable } from '@angular/core';
import * as forEach from 'lodash/forEach';

@Injectable()
export class SvgIconService {

  private icons = {};
  private iconsText = [
    [
      'logo',
      `<?xml version="1.0" encoding="iso-8859-1"?>
      <svg width="64" height="64" viewBox="0 0 64 64" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <title>Logotype</title>
        <g id="Canvas" transform="translate(-688 -64)">
          <g id="Logotype">
            <g id="Rectangle">
              <use xlink:href="#path0_fill" transform="translate(688 99.9024)" fill="#FFFFFF"/>
            </g>
            <g id="Rectangle">
              <use xlink:href="#path1_fill" transform="matrix(6.12323e-17 1 -1 6.12323e-17 752 96)" fill="#FFFFFF"/>
            </g>
            <g id="Rectangle">
              <use xlink:href="#path1_fill" transform="matrix(6.12323e-17 -1 1 6.12323e-17 688 96)" fill="#FFFFFF"/>
            </g>
          </g>
        </g>
        <defs>
          <path id="path0_fill" d="M 0 14.0488C 0 6.28985 6.28985 0 14.0488 0L 28.0976 0L 28.0976 14.0488C 28.0976 21.8077 21.8077 28.0976 14.0488 28.0976C 6.28985 28.0976 0 21.8077 0 14.0488Z"/>
          <path id="path1_fill" d="M 0 16C 0 7.16344 7.16344 0 16 0C 24.8366 0 32 7.16344 32 16C 32 24.8366 24.8366 32 16 32L 0 32L 0 16Z"/>
        </defs>
      </svg>`
    ],
    [
      'file',
      `<?xml version="1.0" encoding="iso-8859-1"?>
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 30 30" style="enable-background:new 0 0 30 30;" xml:space="preserve" width="24px" height="24px">
      <path d="M24.707,8.793l-6.5-6.5C18.019,2.105,17.765,2,17.5,2H7C5.895,2,5,2.895,5,4v22c0,1.105,0.895,2,2,2h16c1.105,0,2-0.895,2-2  V9.5C25,9.235,24.895,8.981,24.707,8.793z M18,10c-0.552,0-1-0.448-1-1V3.904L23.096,10H18z"/>
      </svg>`
    ],
    [
      'arrow-round',
      `<svg width="16" height="10" viewBox="0 0 16 10" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g id="Canvas" transform="matrix(2 0 0 2 -6176 -176)">
      <g id="Vector">
      <use xlink:href="#path0_stroke" transform="matrix(1 2.67189e-24 -2.67189e-24 1 3089 89)"/>
      </g>
      </g>
      <defs>
      <path id="path0_stroke" d="M 6.70711 0.707107C 7.09763 0.316583 7.09763 -0.316583 6.70711 -0.707107C 6.31658 -1.09763 5.68342 -1.09763 5.29289 -0.707107L 6.70711 0.707107ZM 3 3L 2.29289 3.70711C 2.68342 4.09763 3.31658 4.09763 3.70711 3.70711L 3 3ZM 0.707107 -0.707107C 0.316583 -1.09763 -0.316583 -1.09763 -0.707107 -0.707107C -1.09763 -0.316583 -1.09763 0.316583 -0.707107 0.707107L 0.707107 -0.707107ZM 5.29289 -0.707107L 2.29289 2.29289L 3.70711 3.70711L 6.70711 0.707107L 5.29289 -0.707107ZM 3.70711 2.29289L 0.707107 -0.707107L -0.707107 0.707107L 2.29289 3.70711L 3.70711 2.29289Z"/>
      </defs>
      </svg>
      `
    ],
    [
      'expand-arrow',
      `<?xml version="1.0" encoding="iso-8859-1"?>
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 30 30" style="enable-background:new 0 0 30 30;" xml:space="preserve" width="24px" height="24px">
      <polyline style="fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;" points="  25,10 15,20 5,10 "/>
      </svg>
      `
    ],
    [
      'plus',
      `<?xml version="1.0" encoding="utf-8"?>
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve">
      <path d="M22,10h-8V2c0-1.1-0.9-2-2-2s-2,0.9-2,2v8H2c-1.1,0-2,0.9-2,2s0.9,2,2,2h8v8c0,1.1,0.9,2,2,2s2-0.9,2-2v-8h8
        c1.1,0,2-0.9,2-2S23.1,10,22,10z"/>
      </svg>`
    ],
    [
      'view-bars',
      `<svg id="icon_View_bars" data-name="icon View bars" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
      <defs>
          <style>
            .cls-1 {
              fill: none;
              stroke: #282828;
              stroke-width: 2px;
            }
            .cls-2, .cls-3 {
              fill: #282828;
            }
            .cls-2 {
              fill-rule: evenodd;
            }
          </style>
        </defs>
        <rect class="cls-1" x="1" y="1" width="38" height="38" rx="4" ry="4"/>
        <path class="cls-2" d="M1481,1733h1.95v38H1481v-38Z" transform="translate(-1468 -1732)"/>
        <g>
          <rect class="cls-3" x="20" y="8" width="12" height="2"/>
          <rect id="Rectangle_3_copy_3" data-name="Rectangle 3 copy 3" class="cls-3" x="20" y="13" width="12" height="2"/>
          <rect id="Rectangle_3_copy_4" data-name="Rectangle 3 copy 4" class="cls-3" x="20" y="18" width="12" height="2"/>
        </g>
      </svg>
      `
    ],
    [
      'more',
      `<?xml version="1.0" encoding="iso-8859-1"?>
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 30 30" style="enable-background:new 0 0 30 30;" xml:space="preserve" width="24px" height="24px">
      <path d="M15,18c1.657,0,3-1.343,3-3s-1.343-3-3-3s-3,1.343-3,3S13.343,18,15,18z"/>
      <path d="M25,18c1.657,0,3-1.343,3-3s-1.343-3-3-3s-3,1.343-3,3S23.343,18,25,18z"/>
      <path d="M5,18c1.657,0,3-1.343,3-3s-1.343-3-3-3s-3,1.343-3,3S3.343,18,5,18z"/>
      </svg>
      `
    ],
    [
      'beach-ball',
      `<?xml version="1.0" encoding="iso-8859-1"?>
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve" width="24px" height="24px">
      <circle style="fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;" cx="25" cy="25" r="22"/>
      <path style="fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;" d="  M25.948,19.673C17.446,20.379,9.05,25.092,4.008,31.6"/>
      <path style="fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;" d="  M16.292,45.167c4.198-4.738,10.882-15.469,11.476-21.186"/>
      <path style="fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;" d="  M30.106,24.203c3.564,4.01,6.902,14.547,7.36,18.947"/>
      <path style="fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;" d="  M46.542,29.492c0-0.092,0-0.092-0.092-0.183c-4.033-8.433-14.667-9.9-14.667-9.9"/>
      <path style="fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;" d="  M30.5,18.217c0.642-1.467,2.567-9.35,1.558-13.842"/>
      <path style="fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;" d="  M14.825,5.567c2.658,0.733,9.9,8.617,11.642,12.925"/>
      <circle style="fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;" cx="29" cy="21" r="3"/>
      <path d="M15,5c0,0,6-2,10-2s7,2,7,2s1,4,0,7s-2,6-2,6l-3,1C27,19,19,7,15,5z"/>
      <path d="M32,20c0,0,12,2,14,10c0,5-7,12-8,13c-1-2-6-19-8-19C32,23,32,20,32,20z"/>
      <path d="M26,20c0,0,1,3,2,4s-7,17-11,21c-2,1-12-7-13-14C9,25,18,19,26,20z"/>
      </svg>
      `
    ]
  ]

  constructor() {
    this.prepareIcons();
  }

  getIcon(iconName) {
    if (this.icons[iconName]) {
      return this.icons[iconName].cloneNode(true)
    } {
      return null;
    }
  }

  private prepareIcons() {
    forEach(this.iconsText, icon => {
      this.icons[icon[0]] = this.getSvgNodeFromText(icon[1]);
    });
  }

  private getSvgNodeFromText(text) {
    const div = document.createElement('DIV');
    div.innerHTML = text;
    div.querySelector('svg');
    const svgElement = div.querySelector('svg');

    svgElement.setAttribute('width', '100%');
    svgElement.setAttribute('height', '100%');
    svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    return svgElement;
  }

}

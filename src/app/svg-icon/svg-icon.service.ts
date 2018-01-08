import { Injectable } from '@angular/core';
import * as forEach from 'lodash/forEach';

@Injectable()
export class SvgIconService {

  private icons = {};
  private iconsText = [
    [
      'logo',
      `<svg width="64" height="64" viewBox="0 0 64 64" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <title>Logotype</title>
      <g id="Canvas" transform="translate(-688 -64)">
      <g id="Logotype">
      <g id="Code">
      <g id="Rectangle 2" opacity="0.16">
      <use xlink:href="#path0_fill" transform="translate(725.703 75.7544)" fill="#FFFFFF"/>
      </g>
      <g id="Rectangle 2.19" opacity="0.48">
      <use xlink:href="#path1_fill" transform="translate(699.503 75.7544)" fill="#FFFFFF"/>
      </g>
      <g id="Rectangle 2.2" opacity="0.48">
      <use xlink:href="#path2_fill" transform="translate(702.679 90.0454)" fill="#FFFFFF"/>
      </g>
      <g id="Rectangle 2.5" opacity="0.48">
      <use xlink:href="#path3_fill" transform="translate(705.855 94.8091)" fill="#FFFFFF"/>
      </g>
      <g id="Rectangle 2.16" opacity="0.16">
      <use xlink:href="#path4_fill" transform="translate(727.291 94.8091)" fill="#FFFFFF"/>
      </g>
      <g id="Rectangle 2.6" opacity="0.48">
      <use xlink:href="#path5_fill" transform="translate(699.503 99.5728)" fill="#FFFFFF"/>
      </g>
      <g id="Rectangle 2.15" opacity="0.16">
      <use xlink:href="#path6_fill" transform="translate(713.397 99.5728)" fill="#FFFFFF"/>
      </g>
      <g id="Rectangle 2.7" opacity="0.48">
      <use xlink:href="#path7_fill" transform="translate(702.679 104.336)" fill="#FFFFFF"/>
      </g>
      <g id="Rectangle 2.3" opacity="0.48">
      <use xlink:href="#path7_fill" transform="translate(702.679 80.5181)" fill="#FFFFFF"/>
      </g>
      <g id="Rectangle 2.4" opacity="0.48">
      <use xlink:href="#path8_fill" transform="translate(699.503 85.2818)" fill="#FFFFFF"/>
      </g>
      <g id="Rectangle 2.14" opacity="0.16">
      <use xlink:href="#path9_fill" transform="translate(724.116 85.2818)" fill="#FFFFFF"/>
      </g>
      <g id="Rectangle 2.8" opacity="0.48">
      <use xlink:href="#path10_fill" transform="translate(702.679 109.1)" fill="#FFFFFF"/>
      </g>
      <g id="Rectangle 2.17" opacity="0.16">
      <use xlink:href="#path11_fill" transform="translate(718.955 109.1)" fill="#FFFFFF"/>
      </g>
      <g id="Rectangle 2.13" opacity="0.48">
      <use xlink:href="#path12_fill" transform="translate(699.503 113.864)" fill="#FFFFFF"/>
      </g>
      <g id="Rectangle 2.18" opacity="0.16">
      <use xlink:href="#path13_fill" transform="translate(718.955 113.864)" fill="#FFFFFF"/>
      </g>
      </g>
      <g id="diamond (Stroke)">
      <use xlink:href="#path14_fill" transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 752 96)" fill="#FFFFFF"/>
      </g>
      </g>
      </g>
      <defs>
      <path id="path0_fill" d="M 0 1.19092C 0 0.533192 0.533192 0 1.19092 0L 13.1001 0C 13.7578 0 14.291 0.533192 14.291 1.19092L 14.291 1.19092C 14.291 1.84864 13.7578 2.38183 13.1001 2.38183L 1.19092 2.38183C 0.533191 2.38183 0 1.84864 0 1.19092L 0 1.19092Z"/>
      <path id="path1_fill" d="M 0 1.19092C 0 0.533192 0.533192 0 1.19092 0L 22.6274 0C 23.2851 0 23.8183 0.533192 23.8183 1.19092L 23.8183 1.19092C 23.8183 1.84864 23.2851 2.38183 22.6274 2.38183L 1.19092 2.38183C 0.533192 2.38183 0 1.84864 0 1.19092L 0 1.19092Z"/>
      <path id="path2_fill" d="M 0 1.19092C 0 0.533192 0.533192 0 1.19092 0L 31.3608 0C 32.0185 0 32.5517 0.533192 32.5517 1.19092L 32.5517 1.19092C 32.5517 1.84864 32.0185 2.38183 31.3608 2.38183L 1.19092 2.38183C 0.533192 2.38183 0 1.84864 0 1.19092L 0 1.19092Z"/>
      <path id="path3_fill" d="M 0 1.19092C 0 0.533192 0.533192 0 1.19092 0L 17.8638 0C 18.5215 0 19.0547 0.533192 19.0547 1.19092L 19.0547 1.19092C 19.0547 1.84864 18.5215 2.38183 17.8638 2.38183L 1.19092 2.38183C 0.533192 2.38183 0 1.84864 0 1.19092L 0 1.19092Z"/>
      <path id="path4_fill" d="M 0 1.19092C 0 0.533192 0.533192 0 1.19092 0L 11.5122 0C 12.1699 0 12.7031 0.533192 12.7031 1.19092L 12.7031 1.19092C 12.7031 1.84864 12.1699 2.38183 11.5122 2.38183L 1.19092 2.38183C 0.533191 2.38183 0 1.84864 0 1.19092L 0 1.19092Z"/>
      <path id="path5_fill" d="M 0 1.19092C 0 0.533192 0.533192 0 1.19092 0L 10.3213 0C 10.979 0 11.5122 0.533192 11.5122 1.19092L 11.5122 1.19092C 11.5122 1.84864 10.979 2.38183 10.3213 2.38183L 1.19092 2.38183C 0.533192 2.38183 0 1.84864 0 1.19092L 0 1.19092Z"/>
      <path id="path6_fill" d="M 0 1.19092C 0 0.533192 0.533192 0 1.19092 0L 19.4516 0C 20.1094 0 20.6426 0.533192 20.6426 1.19092L 20.6426 1.19092C 20.6426 1.84864 20.1094 2.38183 19.4516 2.38183L 1.19092 2.38183C 0.533192 2.38183 0 1.84864 0 1.19092L 0 1.19092Z"/>
      <path id="path7_fill" d="M 0 1.19092C 0 0.533192 0.533192 0 1.19092 0L 24.2153 0C 24.873 0 25.4062 0.533192 25.4062 1.19092L 25.4062 1.19092C 25.4062 1.84864 24.873 2.38183 24.2153 2.38183L 1.19092 2.38183C 0.533191 2.38183 0 1.84864 0 1.19092L 0 1.19092Z"/>
      <path id="path8_fill" d="M 0 1.19092C 0 0.533192 0.533192 0 1.19092 0L 21.0395 0C 21.6973 0 22.2304 0.533192 22.2304 1.19092L 22.2304 1.19092C 22.2304 1.84864 21.6973 2.38183 21.0395 2.38183L 1.19092 2.38183C 0.533192 2.38183 0 1.84864 0 1.19092L 0 1.19092Z"/>
      <path id="path9_fill" d="M 0 1.19092C 0 0.533192 0.533192 0 1.19092 0L 7.1455 0C 7.80323 0 8.33642 0.533192 8.33642 1.19092L 8.33642 1.19092C 8.33642 1.84864 7.80323 2.38183 7.1455 2.38183L 1.19092 2.38183C 0.533192 2.38183 0 1.84864 0 1.19092L 0 1.19092Z"/>
      <path id="path10_fill" d="M 0 1.19092C 0 0.533192 0.533192 0 1.19092 0L 12.7031 0C 13.3608 0 13.894 0.533192 13.894 1.19092L 13.894 1.19092C 13.894 1.84864 13.3608 2.38183 12.7031 2.38183L 1.19092 2.38183C 0.533191 2.38183 0 1.84864 0 1.19092L 0 1.19092Z"/>
      <path id="path11_fill" d="M 0 1.19092C 0 0.533192 0.533192 0 1.19092 0L 11.1152 0C 11.7729 0 12.3061 0.533192 12.3061 1.19092L 12.3061 1.19092C 12.3061 1.84864 11.7729 2.38183 11.1152 2.38183L 1.19092 2.38183C 0.533191 2.38183 0 1.84864 0 1.19092L 0 1.19092Z"/>
      <path id="path12_fill" d="M 0 1.19092C 0 0.533192 0.533192 0 1.19092 0L 15.8789 0C 16.5366 0 17.0698 0.533192 17.0698 1.19092L 17.0698 1.19092C 17.0698 1.84864 16.5366 2.38183 15.8789 2.38183L 1.19092 2.38183C 0.533192 2.38183 0 1.84864 0 1.19092L 0 1.19092Z"/>
      <path id="path13_fill" d="M 0 1.19092C 0 0.533192 0.533192 0 1.19092 0L 16.6728 0C 17.3306 0 17.8638 0.533192 17.8638 1.19092L 17.8638 1.19092C 17.8638 1.84864 17.3306 2.38183 16.6728 2.38183L 1.19092 2.38183C 0.533192 2.38183 0 1.84864 0 1.19092L 0 1.19092Z"/>
      <path id="path14_fill" fill-rule="evenodd" d="M 10.7183 2.38183C 10.3357 2.38119 9.99744 2.40355 9.62793 2.45236C 8.97573 2.53743 8.37805 2.07768 8.29298 1.42548C 8.20791 0.773284 8.66765 0.175606 9.31985 0.0905319C 9.76488 0.0330941 10.2573 0.000646051 10.7183 0L 12.0415 0C 12.6992 0 13.2324 0.533192 13.2324 1.19092C 13.2324 1.84864 12.6992 2.38183 12.0415 2.38183L 10.7183 2.38183ZM 16.1435 1.19092C 16.1435 0.533192 16.6767 0 17.3345 0L 19.9809 0C 20.6387 0 21.1719 0.533192 21.1719 1.19092C 21.1719 1.84864 20.6387 2.38183 19.9809 2.38183L 17.3345 2.38183C 16.6767 2.38183 16.1435 1.84864 16.1435 1.19092ZM 24.083 1.19092C 24.083 0.533192 24.6162 0 25.2739 0L 27.9204 0C 28.5781 0 29.1113 0.533192 29.1113 1.19092C 29.1113 1.84864 28.5781 2.38183 27.9204 2.38183L 25.2739 2.38183C 24.6162 2.38183 24.083 1.84864 24.083 1.19092ZM 32.0224 1.19092C 32.0224 0.533192 32.5556 0 33.2133 0L 34.5366 0C 34.9976 0.000646051 35.49 0.0330941 35.935 0.090532C 36.5872 0.175606 37.0469 0.773285 36.9619 1.42548C 36.8768 2.07768 36.2791 2.53743 35.6269 2.45236C 35.2574 2.40355 34.9191 2.38119 34.5366 2.38183L 33.2133 2.38183C 32.5556 2.38183 32.0224 1.84864 32.0224 1.19092ZM 5.86246 2.43361C 6.26323 2.95513 6.16534 3.7028 5.64382 4.10357C 5.0437 4.56156 4.56156 5.0437 4.10357 5.64382C 3.7028 6.16534 2.95514 6.26323 2.43361 5.86246C 1.91209 5.46169 1.8142 4.71403 2.21497 4.1925C 2.77136 3.47261 3.47261 2.77136 4.1925 2.21497C 4.71403 1.8142 5.46169 1.91209 5.86246 2.43361ZM 39.3924 2.43361C 39.7931 1.91209 40.5408 1.8142 41.0623 2.21497C 41.7822 2.77136 42.4835 3.47261 43.0399 4.1925C 43.4406 4.71403 43.3427 5.46169 42.8212 5.86246C 42.2997 6.26323 41.552 6.16534 41.1513 5.64382C 40.6933 5.0437 40.2111 4.56156 39.611 4.10357C 39.0895 3.7028 38.9916 2.95514 39.3924 2.43361ZM 1.42548 8.29298C 2.07768 8.37805 2.53743 8.97573 2.45236 9.62793C 2.40355 9.99744 2.38119 10.3357 2.38183 10.7183L 2.38183 12.0415C 2.38183 12.6992 1.84864 13.2324 1.19092 13.2324C 0.533192 13.2324 0 12.6992 0 12.0415L 0 10.7183C 0.000646051 10.2573 0.0330941 9.76487 0.090532 9.31985C 0.175606 8.66765 0.773285 8.20791 1.42548 8.29298ZM 43.8294 8.29298C 44.4816 8.20791 45.0792 8.66765 45.1643 9.31985C 45.2217 9.76488 45.2542 10.2573 45.2548 10.7183L 45.2548 12.0415C 45.2548 12.6992 44.7216 13.2324 44.0639 13.2324C 43.4062 13.2324 42.873 12.6992 42.873 12.0415L 42.873 10.7183C 42.8736 10.3357 42.8513 9.99744 42.8025 9.62793C 42.7174 8.97573 43.1772 8.37805 43.8294 8.29298ZM 1.19092 16.1435C 1.84864 16.1435 2.38183 16.6767 2.38183 17.3345L 2.38183 19.9809C 2.38183 20.6387 1.84864 21.1719 1.19092 21.1719C 0.533192 21.1719 0 20.6387 0 19.9809L 0 17.3345C 0 16.6767 0.533192 16.1435 1.19092 16.1435ZM 44.0639 16.1435C 44.7216 16.1435 45.2548 16.6767 45.2548 17.3345L 45.2548 19.9809C 45.2548 20.6387 44.7216 21.1719 44.0639 21.1719C 43.4062 21.1719 42.873 20.6387 42.873 19.9809L 42.873 17.3345C 42.873 16.6767 43.4062 16.1435 44.0639 16.1435ZM 44.0639 24.083C 44.7216 24.083 45.2548 24.6162 45.2548 25.2739L 45.2548 27.9204C 45.2548 28.5781 44.7216 29.1113 44.0639 29.1113C 43.4062 29.1113 42.873 28.5781 42.873 27.9204L 42.873 25.2739C 42.873 24.6162 43.4062 24.083 44.0639 24.083ZM 1.19092 24.083C 1.84864 24.083 2.38183 24.6162 2.38183 25.2739L 2.38183 27.9204C 2.38183 28.5781 1.84864 29.1113 1.19092 29.1113C 0.533192 29.1113 0 28.5781 0 27.9204L 0 25.2739C 0 24.6162 0.533192 24.083 1.19092 24.083ZM 1.19092 32.0224C 1.84864 32.0224 2.38183 32.5556 2.38183 33.2133L 2.38183 34.5366C 2.38119 34.9191 2.40355 35.2574 2.45236 35.6269C 2.53743 36.2791 2.07768 36.8768 1.42548 36.9619C 0.773284 37.0469 0.175606 36.5872 0.0905319 35.935C 0.0330941 35.49 0.000646051 34.9976 0 34.5366L 0 33.2133C 0 32.5556 0.533192 32.0224 1.19092 32.0224ZM 44.0639 32.0224C 44.7216 32.0224 45.2548 32.5556 45.2548 33.2133L 45.2548 34.5366C 45.2542 34.9976 45.2217 35.49 45.1643 35.935C 45.0792 36.5872 44.4816 37.0469 43.8294 36.9619C 43.1772 36.8768 42.7174 36.2791 42.8025 35.6269C 42.8513 35.2574 42.8736 34.9191 42.873 34.5366L 42.873 33.2133C 42.873 32.5556 43.4062 32.0224 44.0639 32.0224ZM 2.43361 39.3924C 2.95513 38.9916 3.7028 39.0895 4.10357 39.611C 4.56156 40.2111 5.0437 40.6933 5.64382 41.1513C 6.16534 41.552 6.26323 42.2997 5.86246 42.8212C 5.46169 43.3427 4.71403 43.4406 4.1925 43.0399C 3.47261 42.4835 2.77136 41.7822 2.21497 41.0623C 1.8142 40.5408 1.91209 39.7931 2.43361 39.3924ZM 42.8212 39.3924C 43.3427 39.7931 43.4406 40.5408 43.0399 41.0623C 42.4835 41.7822 41.7822 42.4835 41.0623 43.0399C 40.5408 43.4406 39.7931 43.3427 39.3924 42.8212C 38.9916 42.2997 39.0895 41.552 39.611 41.1513C 40.2111 40.6933 40.6933 40.2111 41.1513 39.611C 41.552 39.0895 42.2997 38.9916 42.8212 39.3924ZM 8.29298 43.8294C 8.37805 43.1772 8.97573 42.7174 9.62793 42.8025C 9.99744 42.8513 10.3357 42.8736 10.7183 42.873L 12.0415 42.873C 12.6992 42.873 13.2324 43.4062 13.2324 44.0639C 13.2324 44.7216 12.6992 45.2548 12.0415 45.2548L 10.7183 45.2548C 10.2573 45.2542 9.76487 45.2217 9.31985 45.1643C 8.66765 45.0792 8.20791 44.4816 8.29298 43.8294ZM 36.9619 43.8294C 37.0469 44.4816 36.5872 45.0792 35.935 45.1643C 35.49 45.2217 34.9976 45.2542 34.5366 45.2548L 33.2133 45.2548C 32.5556 45.2548 32.0224 44.7216 32.0224 44.0639C 32.0224 43.4062 32.5556 42.873 33.2133 42.873L 34.5366 42.873C 34.9191 42.8736 35.2574 42.8513 35.6269 42.8025C 36.2791 42.7174 36.8768 43.1772 36.9619 43.8294ZM 16.1435 44.0639C 16.1435 43.4062 16.6767 42.873 17.3345 42.873L 19.9809 42.873C 20.6387 42.873 21.1719 43.4062 21.1719 44.0639C 21.1719 44.7216 20.6387 45.2548 19.9809 45.2548L 17.3345 45.2548C 16.6767 45.2548 16.1435 44.7216 16.1435 44.0639ZM 24.083 44.0639C 24.083 43.4062 24.6162 42.873 25.2739 42.873L 27.9204 42.873C 28.5781 42.873 29.1113 43.4062 29.1113 44.0639C 29.1113 44.7216 28.5781 45.2548 27.9204 45.2548L 25.2739 45.2548C 24.6162 45.2548 24.083 44.7216 24.083 44.0639Z"/>
      </defs>
      </svg>
      `
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
      <g id="canvas-arrow-round" transform="matrix(2 0 0 2 -6176 -176)">
      <g id="vector-arrow-round">
      <use xlink:href="#path0_stroke-arrow-round" transform="matrix(1 2.67189e-24 -2.67189e-24 1 3089 89)"/>
      </g>
      </g>
      <defs>
      <path id="path0_stroke-arrow-round" d="M 6.70711 0.707107C 7.09763 0.316583 7.09763 -0.316583 6.70711 -0.707107C 6.31658 -1.09763 5.68342 -1.09763 5.29289 -0.707107L 6.70711 0.707107ZM 3 3L 2.29289 3.70711C 2.68342 4.09763 3.31658 4.09763 3.70711 3.70711L 3 3ZM 0.707107 -0.707107C 0.316583 -1.09763 -0.316583 -1.09763 -0.707107 -0.707107C -1.09763 -0.316583 -1.09763 0.316583 -0.707107 0.707107L 0.707107 -0.707107ZM 5.29289 -0.707107L 2.29289 2.29289L 3.70711 3.70711L 6.70711 0.707107L 5.29289 -0.707107ZM 3.70711 2.29289L 0.707107 -0.707107L -0.707107 0.707107L 2.29289 3.70711L 3.70711 2.29289Z"/>
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
    ],
    [
      'burger',
      `<svg width="16" height="12" viewBox="0 0 16 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g id="canvas-burger" transform="translate(-9154 -16)">
      <g id="menu-burger">
      <g id="vector-burger">
      <use xlink:href="#path0_stroke-burger" transform="translate(9155 22)"/>
      </g>
      <g id="vector-burger">
      <use xlink:href="#path0_stroke-burger" transform="translate(9155 17)"/>
      </g>
      <g id="vector-burger">
      <use xlink:href="#path0_stroke-burger" transform="translate(9155 27)"/>
      </g>
      </g>
      </g>
      <defs>
      <path id="path0_stroke-burger" d="M 0 -1C -0.552285 -1 -1 -0.552285 -1 0C -1 0.552285 -0.552285 1 0 1L 0 -1ZM 14 1C 14.5523 1 15 0.552285 15 0C 15 -0.552285 14.5523 -1 14 -1L 14 1ZM 0 1L 14 1L 14 -1L 0 -1L 0 1Z"/>
      </defs>
      </svg>`
    ],
    [
      'hide-left',
      `<svg width="18" height="18" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g id="canvas-hide-left" transform="translate(-2893 -13)">
      <g id="hide-left">
      <g id="rectangle-hide-left">
      <use xlink:href="#path0_fill-hide-left" transform="translate(2893 13)"/>
      </g>
      <g id="vector-hide-left">
      <use xlink:href="#path1_fill-hide-left" transform="translate(2896 16)"/>
      </g>
      </g>
      </g>
      <defs>
      <path id="path0_fill-hide-left" fill-rule="evenodd" d="M 0 3C 0 1.34315 1.34315 0 3 0L 15 0C 16.6569 0 18 1.34315 18 3L 18 15C 18 16.6569 16.6569 18 15 18L 3 18C 1.34315 18 0 16.6569 0 15L 0 3ZM 3 2C 2.44772 2 2 2.44772 2 3L 2 15C 2 15.5523 2.44772 16 3 16L 15 16C 15.5523 16 16 15.5523 16 15L 16 3C 16 2.44772 15.5523 2 15 2L 3 2Z"/>
      <path id="path1_fill-hide-left" fill-rule="evenodd" d="M 0 1C 0 0.447715 0.447715 0 1 0L 2.9999 0C 3.55218 0 3.9999 0.447715 3.9999 1L 3.9999 11C 3.9999 11.5523 3.55218 12 2.9999 12L 1 12C 0.447715 12 0 11.5523 0 11L 0 1Z"/>
      </defs>
      </svg>
      `
    ],
    [
      'hide-bot',
      `<svg width="18" height="18" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g id="canvas-hide-bot" transform="translate(-2921 -13)">
      <g id="hide-bot">
      <g id="rectangle-hide-bot">
      <use xlink:href="#path0_fill-hide-bot" transform="translate(2921 13)"/>
      </g>
      <g id="vector-hide-bot">
      <use xlink:href="#path1_fill-hide-bot" transform="translate(2924 24)"/>
      </g>
      </g>
      </g>
      <defs>
      <path id="path0_fill-hide-bot" fill-rule="evenodd" d="M 0 3C 0 1.34315 1.34315 0 3 0L 15 0C 16.6569 0 18 1.34315 18 3L 18 15C 18 16.6569 16.6569 18 15 18L 3 18C 1.34315 18 0 16.6569 0 15L 0 3ZM 3 2C 2.44772 2 2 2.44772 2 3L 2 15C 2 15.5523 2.44772 16 3 16L 15 16C 15.5523 16 16 15.5523 16 15L 16 3C 16 2.44772 15.5523 2 15 2L 3 2Z"/>
      <path id="path1_fill-hide-bot" fill-rule="evenodd" d="M 0 1C 0 0.447715 0.447715 0 1 0L 11 0C 11.5523 0 12 0.447715 12 1L 12 3C 12 3.55228 11.5523 4 11 4L 1 4C 0.447715 4 0 3.55228 0 3L 0 1Z"/>
      </defs>
      </svg>
      `
    ],
    [
      'hide-right',
      `<svg width="18" height="18" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g id="canvas-hide-right" transform="translate(-2949 -13)">
      <g id="hide-right">
      <g id="rectangle-hide-right">
      <use xlink:href="#path0_fill-hide-right" transform="translate(2949 13)"/>
      </g>
      <g id="Vector">
      <use xlink:href="#path1_fill-hide-right" transform="translate(2960 16)"/>
      </g>
      </g>
      </g>
      <defs>
      <path id="path0_fill-hide-right" fill-rule="evenodd" d="M 0 3C 0 1.34315 1.34315 0 3 0L 15 0C 16.6569 0 18 1.34315 18 3L 18 15C 18 16.6569 16.6569 18 15 18L 3 18C 1.34315 18 0 16.6569 0 15L 0 3ZM 3 2C 2.44772 2 2 2.44772 2 3L 2 15C 2 15.5523 2.44772 16 3 16L 15 16C 15.5523 16 16 15.5523 16 15L 16 3C 16 2.44772 15.5523 2 15 2L 3 2Z"/>
      <path id="path1_fill-hide-right" fill-rule="evenodd" d="M 0 1C 0 0.447715 0.447715 0 1 0L 2.9999 0C 3.55218 0 3.9999 0.447715 3.9999 1L 3.9999 11C 3.9999 11.5523 3.55218 12 2.9999 12L 1 12C 0.447715 12 0 11.5523 0 11L 0 1Z"/>
      </defs>
      </svg>
      `
    ],
    [
      'export',
      `<svg width="18" height="16" viewBox="0 0 18 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g id="canvas-export" transform="translate(-4489 -1060)">
      <g id="export-export">
      <g id="vector-export">
      <use xlink:href="#path0_stroke-export" transform="translate(4500.77 1068)"/>
      </g>
      <g id="vector-export2">
      <use xlink:href="#path1_stroke-export" transform="translate(4503.38 1065.33)"/>
      </g>
      <g id="vector-export3">
      <use xlink:href="#path2_fill-export" transform="translate(4489 1060)"/>
      </g>
      </g>
      </g>
      <defs>
      <path id="path0_stroke-export" d="M 0 1L 5.23077 1L 5.23077 -1L 0 -1L 0 1Z"/>
      <path id="path1_stroke-export" d="M 0.713938 -0.700209C 0.327224 -1.09451 -0.305911 -1.10065 -0.700209 -0.713938C -1.09451 -0.327224 -1.10065 0.305911 -0.713938 0.700209L 0.713938 -0.700209ZM 2.61538 2.66667L 3.32932 3.36688C 3.71074 2.97798 3.71074 2.35535 3.32932 1.96646L 2.61538 2.66667ZM -0.713938 4.63312C -1.10065 5.02742 -1.09451 5.66056 -0.700209 6.04727C -0.305911 6.43399 0.327224 6.42784 0.713938 6.03354L -0.713938 4.63312ZM -0.713938 0.700209L 1.90145 3.36688L 3.32932 1.96646L 0.713938 -0.700209L -0.713938 0.700209ZM 1.90145 1.96646L -0.713938 4.63312L 0.713938 6.03354L 3.32932 3.36688L 1.90145 1.96646Z"/>
      <path id="path2_fill-export" d="M 7.19231 7L 11.7692 7L 11.7692 4.33333C 11.7692 4.15667 11.7006 3.98667 11.5777 3.862L 7.9815 0.195333C 7.85858 0.07 7.6925 0 7.51923 0L 1.30769 0C 0.585192 0 0 0.596667 0 1.33333L 0 14.6667C 0 15.4033 0.585192 16 1.30769 16L 10.4615 16C 11.184 16 11.7692 15.4033 11.7692 14.6667L 11.7692 9L 7.19231 9C 6.5 9 6 8.5 6 8C 6 7.46094 6.5 7 7.19231 7Z"/>
      </defs>
      </svg>
      `
    ],
    [
      'hunt',
      `<svg width="18" height="18" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g id="canvas-hunt" transform="translate(-3991 -1867)">
      <g id="icons8-hunt">
      <g id="layer-1-hunt">
      <g id="vector-hunt">
      <use xlink:href="#path0_stroke-hunt" transform="translate(3993.23 1869.23)"/>
      </g>
      <g id="vector1-hunt">
      <use xlink:href="#path1_fill-hunt" transform="translate(3997.54 1873.54)"/>
      </g>
      <g id="vector2-hunt">
      <use xlink:href="#path2_stroke-hunt" transform="translate(4000 1868)"/>
      </g>
      <g id="vector3-hunt">
      <use xlink:href="#path2_stroke-hunt" transform="translate(4000 1881.54)"/>
      </g>
      <g id="vector4-hunt">
      <use xlink:href="#path3_stroke-hunt" transform="translate(4005.54 1876)"/>
      </g>
      <g id="vector5-hunt">
      <use xlink:href="#path3_stroke-hunt" transform="translate(3992 1876)"/>
      </g>
      </g>
      </g>
      </g>
      <defs>
      <path id="path0_stroke-hunt" d="M 12.5385 6.76923C 12.5385 9.95549 9.95549 12.5385 6.76923 12.5385L 6.76923 14.5385C 11.0601 14.5385 14.5385 11.0601 14.5385 6.76923L 12.5385 6.76923ZM 6.76923 12.5385C 3.58297 12.5385 1 9.95549 1 6.76923L -1 6.76923C -1 11.0601 2.4784 14.5385 6.76923 14.5385L 6.76923 12.5385ZM 1 6.76923C 1 3.58297 3.58297 1 6.76923 1L 6.76923 -1C 2.4784 -1 -1 2.4784 -1 6.76923L 1 6.76923ZM 6.76923 1C 9.95549 1 12.5385 3.58297 12.5385 6.76923L 14.5385 6.76923C 14.5385 2.4784 11.0601 -1 6.76923 -1L 6.76923 1Z"/>
      <path id="path1_fill-hunt" d="M 2.46154 4.92308C 3.82101 4.92308 4.92308 3.82101 4.92308 2.46154C 4.92308 1.10207 3.82101 0 2.46154 0C 1.10207 0 0 1.10207 0 2.46154C 0 3.82101 1.10207 4.92308 2.46154 4.92308Z"/>
      <path id="path2_stroke-hunt" d="M 1 0C 1 -0.552285 0.552285 -1 0 -1C -0.552285 -1 -1 -0.552285 -1 0L 1 0ZM -1 2.46154C -1 3.01382 -0.552285 3.46154 0 3.46154C 0.552285 3.46154 1 3.01382 1 2.46154L -1 2.46154ZM -1 0L -1 2.46154L 1 2.46154L 1 0L -1 0Z"/>
      <path id="path3_stroke-hunt" d="M 2.46154 1C 3.01382 1 3.46154 0.552285 3.46154 0C 3.46154 -0.552285 3.01382 -1 2.46154 -1L 2.46154 1ZM 0 -1C -0.552285 -1 -1 -0.552285 -1 0C -1 0.552285 -0.552285 1 0 1L 0 -1ZM 2.46154 -1L 0 -1L 0 1L 2.46154 1L 2.46154 -1Z"/>
      </defs>
      </svg>
      `
    ],
    [
      'zoom-out',
      `<svg width="18" height="18" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g id="canvas-zoom-out" transform="translate(-4199 -1867)">
      <g id="zoom-out">
      <g id="vector-zoom-out">
      <use xlink:href="#path0_stroke-zoom-out" transform="translate(4200 1868)"/>
      </g>
      <g id="Vector">
      <use xlink:href="#path1_stroke-zoom-out" transform="translate(4211.18 1879.18)"/>
      </g>
      <g id="Vector">
      <use xlink:href="#path2_stroke-zoom-out" transform="translate(4203.64 1874.55)"/>
      </g>
      </g>
      </g>
      <defs>
      <path id="path0_stroke-zoom-out" d="M 12.0909 6.54545C 12.0909 9.60812 9.60812 12.0909 6.54545 12.0909L 6.54545 14.0909C 10.7127 14.0909 14.0909 10.7127 14.0909 6.54545L 12.0909 6.54545ZM 6.54545 12.0909C 3.48278 12.0909 1 9.60812 1 6.54545L -1 6.54545C -1 10.7127 2.37821 14.0909 6.54545 14.0909L 6.54545 12.0909ZM 1 6.54545C 1 3.48278 3.48278 1 6.54545 1L 6.54545 -1C 2.37821 -1 -1 2.37821 -1 6.54545L 1 6.54545ZM 6.54545 1C 9.60812 1 12.0909 3.48278 12.0909 6.54545L 14.0909 6.54545C 14.0909 2.37821 10.7127 -1 6.54545 -1L 6.54545 1Z"/>
      <path id="path1_stroke-zoom-out" d="M 4.11107 5.52529C 4.5016 5.91581 5.13476 5.91581 5.52529 5.52529C 5.91581 5.13476 5.91581 4.5016 5.52529 4.11107L 4.11107 5.52529ZM 0.707107 -0.707107C 0.316583 -1.09763 -0.316583 -1.09763 -0.707107 -0.707107C -1.09763 -0.316583 -1.09763 0.316583 -0.707107 0.707107L 0.707107 -0.707107ZM 5.52529 4.11107L 0.707107 -0.707107L -0.707107 0.707107L 4.11107 5.52529L 5.52529 4.11107Z"/>
      <path id="path2_stroke-zoom-out" d="M 5.81818 1C 6.37047 1 6.81818 0.552284 6.81818 -3.8147e-07C 6.81818 -0.552285 6.37047 -1 5.81818 -1L 5.81818 1ZM -1.73395e-07 -1C -0.552285 -1 -1 -0.552285 -1 -3.8147e-07C -1 0.552284 -0.552285 1 -1.73395e-07 1L -1.73395e-07 -1ZM 5.81818 -1L -1.73395e-07 -1L -1.73395e-07 1L 5.81818 1L 5.81818 -1Z"/>
      </defs>
      </svg>
      `
    ],
    [
      'zoom-in',
      `<svg width="18" height="18" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g id="canvas-zoom-in" transform="translate(-4279 -1867)">
      <g id="zoom-in">
      <g id="vector-zoom-in">
      <use xlink:href="#path0_stroke-zoom-in" transform="translate(4280 1868)"/>
      </g>
      <g id="vector1-zoom-in">
      <use xlink:href="#path1_stroke-zoom-in" transform="translate(4291.23 1879.23)"/>
      </g>
      <g id="vector2-zoom-in">
      <use xlink:href="#path2_stroke-zoom-in" transform="translate(4286.55 1871.64)"/>
      </g>
      <g id="vector3-zoom-in">
      <use xlink:href="#path3_stroke-zoom-in" transform="translate(4283.64 1874.55)"/>
      </g>
      </g>
      </g>
      <defs>
      <path id="path0_stroke-zoom-in" d="M 12.0909 6.54545C 12.0909 9.60812 9.60812 12.0909 6.54545 12.0909L 6.54545 14.0909C 10.7127 14.0909 14.0909 10.7127 14.0909 6.54545L 12.0909 6.54545ZM 6.54545 12.0909C 3.48278 12.0909 1 9.60812 1 6.54545L -1 6.54545C -1 10.7127 2.37821 14.0909 6.54545 14.0909L 6.54545 12.0909ZM 1 6.54545C 1 3.48278 3.48278 1 6.54545 1L 6.54545 -1C 2.37821 -1 -1 2.37821 -1 6.54545L 1 6.54545ZM 6.54545 1C 9.60812 1 12.0909 3.48278 12.0909 6.54545L 14.0909 6.54545C 14.0909 2.37821 10.7127 -1 6.54545 -1L 6.54545 1Z"/>
      <path id="path1_stroke-zoom-in" d="M 4.06598 5.4802C 4.45651 5.87072 5.08967 5.87072 5.4802 5.4802C 5.87072 5.08967 5.87072 4.45651 5.4802 4.06598L 4.06598 5.4802ZM 0.707107 -0.707107C 0.316583 -1.09763 -0.316582 -1.09763 -0.707107 -0.707107C -1.09763 -0.316582 -1.09763 0.316583 -0.707107 0.707107L 0.707107 -0.707107ZM 5.4802 4.06598L 0.707107 -0.707107L -0.707107 0.707107L 4.06598 5.4802L 5.4802 4.06598Z"/>
      <path id="path2_stroke-zoom-in" d="M 1 0C 1 -0.552285 0.552285 -1 0 -1C -0.552285 -1 -1 -0.552285 -1 0L 1 0ZM -1 5.81818C -1 6.37047 -0.552285 6.81818 0 6.81818C 0.552285 6.81818 1 6.37047 1 5.81818L -1 5.81818ZM -1 0L -1 5.81818L 1 5.81818L 1 0L -1 0Z"/>
      <path id="path3_stroke-zoom-in" d="M 5.81818 1C 6.37047 1 6.81818 0.552285 6.81818 0C 6.81818 -0.552285 6.37047 -1 5.81818 -1L 5.81818 1ZM 0 -1C -0.552285 -1 -1 -0.552285 -1 0C -1 0.552285 -0.552285 1 0 1L 0 -1ZM 5.81818 -1L 0 -1L 0 1L 5.81818 1L 5.81818 -1Z"/>
      </defs>
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

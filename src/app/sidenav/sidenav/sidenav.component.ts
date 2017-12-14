import { Component, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

const animationTransition = '150ms ease';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {'class': 'sidenav-container'},
  animations: [
    trigger('backdropState', [
      state('hidden', style({
        display: 'none',
        visibility: 'hidden',
        opacity: '0'
      })),
      state('shown', style({
        display: 'block',
        visibility: 'visible',
        opacity: 0.48,
      })),
      transition('* => *', animate(animationTransition))
    ]),
    trigger('contentState', [
      state('hidden', style({
        display: 'none',
        visibility: 'hidden',
        transform: 'translate3d(-100%, 0, 0)'
      })),
      state('shown', style({
        display: 'block',
        visibility: 'visible',
        transform: 'translate3d(0, 0, 0)'
      })),
      transition('* => *', animate(animationTransition))
    ])
  ]
})
export class SidenavComponent implements OnInit {

  @Output() onHidden: EventEmitter<any> = new EventEmitter();

  sidenavState = 'hidden';

  constructor() { }

  ngOnInit() {}

  show() {
    this.sidenavState = 'shown';
  }

  hide() {
    this.sidenavState = 'hidden';
  }

  animationDone(ev) {
    if (ev.fromState === 'shown' && ev.toState === 'hidden') {
      this.onHidden.emit();
    }
  }

}

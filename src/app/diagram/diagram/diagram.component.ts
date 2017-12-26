import { Component, OnInit } from '@angular/core';
import * as UML from '@dudes/lumly.uml.viewer'
import { StoreService } from 'app/core/store.service';

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss']
})
export class DiagramComponent implements OnInit {

  uml;

  constructor(
    private store: StoreService
  ) { }

  ngOnInit() {
    this.uml = new UML('diagram');
    this.store.data('JSON-UML').get().subscribe(
      (json) => {
        if (json) {
          this.uml.draw(json);
          // this.uml.draw(`{"title":"Some diagram","type":"usecase-diagram","definitions":{"Actor01":{"title":"John Doe","type":"actor"}}}`);
        } else if (this.uml.diagram) {
          this.uml.diagram.clear();
        }
      }
    )
  }

}

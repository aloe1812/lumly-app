import { Component, OnInit, OnDestroy } from '@angular/core';
import * as UML from '@dudes/lumly.uml.viewer'
import { StoreService } from 'app/core/store.service';
import { ResizeService } from 'app/core/resize.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss']
})
export class DiagramComponent implements OnInit, OnDestroy {

  uml;

  private sub: Subscription;

  constructor(
    private store: StoreService,
    private resizeService: ResizeService
  ) { }

  ngOnInit() {
    this.uml = new UML('diagram', () => {
      alert('Error on building diagram');
    });

    this.resizeService.setUml(this.uml);

    this.sub = this.store.data('JSON-UML').get().subscribe(
      (json) => {
        if (json) {
          this.uml.draw(json);
        } else if (this.uml.diagram) {
          this.uml.diagram.clear();
        }
      }
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}

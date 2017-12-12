import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Observable } from 'rxjs/Observable';

class Source {
  subject?: any;
  obs?: any;
}

/*
Known data & events

==============
data:
==============

==============
events:
==============

*/

@Injectable()
export class StoreService {

  private sourcesData: any = {}; // emits last data on subscribe
  private sourcesEvents: any = {}; // does not emit last data on subscribe

  data(name: string) {
    return {
      get: () => {
        return this.getData(name);
      },
      set: (data?: any) => {
        this.setData(name, data);
      }
    };
  }

  event(name: string) {
    return {
      get: () => {
        return this.getEvent(name);
      },
      emit: (data?: any) => {
        this.dispatchEvent(name, data);
      }
    };
  }

  private getData(name: string): Observable<any> {
    const source = this.findSourceByName('data', name);
    return source.obs;
  }

  private setData(name: string, data?: any): void {
    const source = this.findSourceByName('data', name);
    source.subject.next(data);
  }

  private getEvent(name: string): Observable<any> {
    const source = this.findSourceByName('event', name);
    return source.obs;
  }

  private dispatchEvent(name: string, data?: any): void {
    const source = this.findSourceByName('event', name);
    source.subject.next(data);
  }

  private findSourceByName(type: string, name: string) {
    let isData;

    if (type === 'data') {
      isData = true;
    } else if (type === 'event') {
      isData = false;
    } else {
      throw new Error('Unexpected source type');
    }

    const sources = isData ? this.sourcesData : this.sourcesEvents;

    let source = sources[name];

    if (!source) {
      source = sources[name] = {};

      source.subject = isData ? new BehaviorSubject<any>(null) : new Subject<any>();
      source.obs = source.subject.asObservable();
    }

    return source;
  }

}

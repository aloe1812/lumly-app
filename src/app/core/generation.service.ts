import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as forEach from 'lodash/forEach';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GenerationService {

  editor;
  codeCheckSub;

  private errors = [];

  constructor(
    private http: HttpClient
  ) { }

  checkCode(code): Observable<any> {
    return Observable.create((observer) => {
      this.cancelPrevChecks();

      this.clearErrors();

      if (!code) {
        observer.next(null);
        observer.complete();
        return;
      }

      this.codeCheckSub = this.http.post(
        'https://lzbtfkwzf7.execute-api.ap-northeast-1.amazonaws.com/test/interpreter',
        { code }
      ).subscribe(
        (data: any) => {
          if (data.diagram) {
            observer.next(data.diagram);
          } else if (data.errors) {
            this.setErrors(data.errors);
            observer.next(null);
          }

          observer.complete();
        },
        (error) => {
          console.log(error);
          alert('Error: cannot check code. Something wrong on server');
          observer.next(null);

          observer.complete();
        }
      );
    });
  }

  setEditor(editor) {
    this.editor = editor;
  }

  setErrors(errors) {
    // if (this.errors.length) {
    //   this.clearErrors();
    // }

    // forEach(errors, error => {
    //   this.errors.push(
    //     {
    //       from: CodeMirror.Pos(error.start.line, error.start.offset),
    //       to: CodeMirror.Pos(error.end.line, error.end.offset),
    //       message: error.message
    //     }
    //   );
    // });

    // this.editor.performLint();
  }

  clearErrors() {
    // if (this.errors.length) {
    //   this.errors = [];
    // }
    // this.editor.performLint();
  }

  private cancelPrevChecks() {
    if (this.codeCheckSub) {
      this.codeCheckSub.unsubscribe();
    }
  }

}

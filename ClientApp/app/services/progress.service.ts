import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BrowserXhr } from '@angular/http';

@Injectable()
export class ProgressService {
  uploadProgress: Subject<any> = new Subject();
  downloadProgress: Subject<any> = new Subject();

  constructor() { }

  // XMLHttpRequest
  // Angular uses it internally in a clacc named BrowserXhr
}

// type to autogenerate new service a-service
@Injectable()
export class BrowserXhrWithProgressService extends BrowserXhr {

  constructor(private service: ProgressService) { 
    super();
  }

  build(): XMLHttpRequest {
    var xhr: XMLHttpRequest = super.build();
    
    xhr.onprogress = (event) => {
      // this.service.downloadProgress.next({
      //   total: event.total,
      //   percentage: Math.round(event.loaded / event.loaded * 100)
      // });
      this.service.downloadProgress.next(this.createProgress(event));
    };

    xhr.upload.onprogress = (event) => {
      // this.service.uploadProgress.next({ // next is for pushing value into uploadProgress observable
      //   total: event.total,
      //   percentage: Math.round(event.loaded / event.loaded * 100)
      // });
      this.service.uploadProgress.next(this.createProgress(event));
    };
    
    return xhr;
  }

  private createProgress(event: any) {
    return {
      total: event.total,
      percentage: Math.round(event.loaded / event.loaded * 100)
    };
  }
}
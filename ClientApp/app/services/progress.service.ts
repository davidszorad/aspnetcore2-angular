import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BrowserXhr } from '@angular/http';

@Injectable()
export class ProgressService {
  // uploadProgress: Subject<any> = new Subject(); // because we call this.service.uploadProgress.complete() we need to reinitialize that property
  // downloadProgress: Subject<any> = new Subject();
  private uploadProgress: Subject<any>;
  private downloadProgress: Subject<any>;

  startTrackingUploadProgress() {
    this.uploadProgress = new Subject();
    return this.uploadProgress;
  }

  startTrackingDownloadProgress() {
    this.downloadProgress = new Subject();
    return this.downloadProgress;
  }

  uploadNotify(progress: any) {
    if (this.uploadProgress)
      this.uploadProgress.next(progress);
  }

  downloadNotify(progress: any) {
    if (this.downloadProgress)
      this.downloadProgress.next(progress);
  }

  endTrackingUploadProgress() {
    if (this.uploadProgress)
      this.uploadProgress.complete();
  }

  endTrackingDownloadProgress() {
    if (this.downloadProgress)  
      this.downloadProgress.complete();
  }

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
      this.service.downloadNotify(this.createProgress(event));
    };

    xhr.onloadend = () => {
      // this.service.downloadProgress.complete();
      this.service.endTrackingDownloadProgress();
    };

    xhr.upload.onprogress = (event) => {
      // this.service.uploadProgress.next({ // next is for pushing value into uploadProgress observable
      //   total: event.total,
      //   percentage: Math.round(event.loaded / event.loaded * 100)
      // });
      // this.service.uploadProgress.next(this.createProgress(event));
      this.service.uploadNotify(this.createProgress(event));
    };

    xhr.upload.onloadend = () => {
      // console.log("BEFORE", this.service.uploadProgress);  // 1 observer
      // this.service.uploadProgress.complete();  // Better way than -> from view-vehicle.component.ts: we can assign it to some variable e.g. subscription and then e.g. when displaying photo this.photos.push(photo) call this.subscription.unsubscribe -> but better way is to handle it in progress.service
      // console.log("AFTER", this.service.uploadProgress);  // 0 observer ... if we did not call this.service.uploadProgress.complete() we would have the next time the method will be called 2 observers 
      this.service.endTrackingUploadProgress();
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
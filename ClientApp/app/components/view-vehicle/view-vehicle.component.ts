import { ToastyService } from 'ng2-toasty';
import { VehicleService } from './../../services/vehicle.service';
import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PhotoService } from '../../services/photo.service';
import { ProgressService, BrowserXhrWithProgressService } from '../../services/progress.service';
import { BrowserXhr } from '@angular/http';
import { AuthService } from '../../services/auth.service';

@Component({
  templateUrl: 'view-vehicle.component.html',
  providers: [
    { provide: BrowserXhr, useClass: BrowserXhrWithProgressService },
    ProgressService
  ]
})
export class ViewVehicleComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef; // ViewChild decorator -> for referencing #fileInput template variable
  photos: any[];
  progress: any;
  vehicle: any;
  vehicleId: number; 

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router,
    private photoService: PhotoService,
    private progressService: ProgressService,
    private toasty: ToastyService,
    private vehicleService: VehicleService,
    private zone: NgZone) { 

    route.params.subscribe(p => {
      this.vehicleId = +p['id'];
      if (isNaN(this.vehicleId) || this.vehicleId <= 0) {
        router.navigate(['/vehicles']);
        return; 
      }
    });
  }

  ngOnInit() { 
    this.photoService.getPhotos(this.vehicleId)
      .subscribe(photos => this.photos = photos);
    
    this.vehicleService.getVehicle(this.vehicleId)
      .subscribe(
        v => this.vehicle = v,
        err => {
          if (err.status == 404) {
            this.router.navigate(['/vehicles']);
            return; 
          }
        });
  }

  delete() {
    if (confirm("Are you sure?")) {
      this.vehicleService.delete(this.vehicle.id)
        .subscribe(x => {
          this.router.navigate(['/vehicles']);
        });
    }
  }

  uploadPhoto() {
    this.progressService.startTrackingUploadProgress()  //.uploadProgress // we can assign it to some variable e.g. subscription and then e.g. when displaying photo this.photos.push(photo) call this.subscription.unsubscribe -> but better way is to handle it in progress.service
      .subscribe(progress => {
        console.log(progress);
        // we need to run it inside zone because otherwise angular won't know about the progress state as it is async operation -> one of: browser events/handlers; AJAX requests; timer functions (setTimeout, setInterval)
        this.zone.run(() => {
          this.progress = progress;
        });
      },
      undefined, 
      () => { this.progress = null; });

    var nativeElement: HTMLInputElement = this.fileInput.nativeElement;
    if (nativeElement.files) {
      var file = nativeElement.files[0];
      nativeElement.value = '';
      this.photoService.upload(this.vehicleId, file)
        .subscribe(photo => {
          this.photos.push(photo);
        },
        err => {
          console.log(err);
          this.toasty.error({
            title: 'Error',
            msg: err.text(),
            theme: 'bootstrap',
            showClose: true,
            timeout: 5000 
          });
        });
    }
  }
}
import * as _ from 'underscore';
import { VehicleService } from './../../services/vehicle.service';
import { Component, OnInit, NgModule } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/Observable/forkJoin';
import { SaveVehicle, Vehicle } from '../../models/vehicle';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent implements OnInit {
  makes: any[];
  models: any[];
  features: any[];
  vehicle: SaveVehicle = {
    id: 0,
    makeId: 0,
    modelId: 0,
    isRegistered: false,
    features: [],
    contact: {
      name: '',
      phone: '',
      email: ''
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService, 
    private toastyService: ToastyService) { 

      route.params.subscribe(p => {
        this.vehicle.id = +p['id']; // plus sign converts p['id'] to number
      });
    }

  ngOnInit() {
    // Order does not matter as it will go to server in parallel
    var sources = [
      this.vehicleService.getMakes(),
      this.vehicleService.getFeatures(),
    ];
    if (this.vehicle.id) {
      sources.push(this.vehicleService.getVehicle(this.vehicle.id));
    }
    
    Observable.forkJoin(sources)
      .subscribe(data => {
        this.makes = data[0];
        this.features = data[1];
        if (this.vehicle.id) {
          this.setVehicle(data[2]);
          this.populateModels();
        }
      }, err => {
        if (err.status == 404) {
          this.router.navigate(['/home']);
        }
      });
    
    /*
    if (this.vehicle.id) {
      this.vehicleService.getVehicle(this.vehicle.id)
        .subscribe(v => {
          this.vehicle = v;
        }, err => {
          if (err.status == 404) {
            this.router.navigate(['/home']);
          }
        });
    }
    this.vehicleService.getMakes()
      .subscribe(makes => this.makes = makes);
    this.vehicleService.getFeatures()
      .subscribe(features => this.features = features);
    */
  }

  /*
  async
  ==============================
  ngOnInit() {
    this.makeService.getMakes().subscribe(makes => {
      this.makes = makes;
      console.log("MAKES", this.makes);
    });
  }
  */

  onMakeChange() {
    this.populateModels();
    delete this.vehicle.modelId;
  }

  private populateModels() {
    var selectedMake = this.makes.find(m => m.id == this.vehicle.makeId);
    this.models = selectedMake ? selectedMake.models : [];
  }

  onFeatureToggle(featureId: any, $event: any) {
    if ($event.target.checked) {
      this.vehicle.features.push(featureId);
    } else {
      var index = this.vehicle.features.indexOf(featureId);
      this.vehicle.features.splice(index, 1);
    }
  }

  submit() {
    if (this.vehicle.id) {
      this.vehicleService.update(this.vehicle)
        .subscribe(
          x => {
            this.toastyService.success({
              title: 'Success',
              msg: `Vehicle with ID: ${this.vehicle.id} was updated.`,
              theme: 'bootstrap',
              showClose: true,
              timeout: 5000 
          });
          }
        );
    } else {
      this.vehicleService.create(this.vehicle)
        .subscribe(
          x => {
            this.toastyService.success({
              title: 'Success',
              msg: 'New vehicle created.',
              theme: 'bootstrap',
              showClose: true,
              timeout: 5000 
          });
          }
        );
    }
  }

  delete() {
    if (confirm('Are you sure?')) {
      this.vehicleService.delete(this.vehicle.id)
        .subscribe(x => {
          this.router.navigate(['/home']);
        });
    }
  }

  private setVehicle(v: Vehicle) {
    this.vehicle.id = v.id,
    this.vehicle.makeId = v.make.id;
    this.vehicle.modelId = v.model.id;
    this.vehicle.isRegistered = v.isRegistered;
    this.vehicle.contact = v.contact;
    //this.vehicle.features = v.features; --> not working because we need to do mapping here -> solution: npm install underscore and npm install @types/underscore (map from array of keyvaluepairs to array of numbers) -> then in webpack.config.vendor.js add underscore
    this.vehicle.features = _.pluck(v.features, 'id');
  }
}

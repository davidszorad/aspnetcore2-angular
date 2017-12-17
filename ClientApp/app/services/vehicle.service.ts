import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { SaveVehicle } from '../models/vehicle';
import { validateConfig } from '@angular/router/src/config';
import { HelpersService } from './helpers.service';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class VehicleService {
  private readonly vehicleEndpoint = '/api/vehicles';

  constructor(private http: Http, private authHttp: AuthHttp, private helpersService: HelpersService) { }

  getVehicle(id: any) {
    return this.http.get(this.vehicleEndpoint + '/' + id)
      .map(res => res.json());
  }

  getVehicles(filter: any) {
    return this.http.get('/api/vehicles' + '?' + this.helpersService.toQueryString(filter))
      .map(res => res.json());
  }
  
  getMakes() {
    let bla1 = this.http.get('/api/makes');
    let bla2 = bla1.map(res => res.json());

    bla2.subscribe(makes => console.log(makes));
    return bla2;
  }

  getFeatures() {
    return this.http.get('/api/features')
      .map(res => res.json());
  }

  create(vehicle: SaveVehicle) {
    return this.authHttp.post(this.vehicleEndpoint, vehicle)
      .map(res => res.json());
  }

  update(vehicle: SaveVehicle) {
    return this.authHttp.put(this.vehicleEndpoint + '/' + vehicle.id, vehicle)
      .map(res => res.json());
  }

  delete(id: number) {
    return this.authHttp.delete(this.vehicleEndpoint + '/' + id)
      .map(res => res.json());
  }

}

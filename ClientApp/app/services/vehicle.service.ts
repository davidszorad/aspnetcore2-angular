import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class VehicleService {

  constructor(private http: Http) { }

  getVehicle(id: any) {
    return this.http.get('/api/vehicles/' + id)
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

  create(vehicle: any) {
    return this.http.post('/api/vehicles', vehicle)
      .map(res => res.json());
  }

}

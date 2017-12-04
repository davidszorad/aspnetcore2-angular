import { Injectable } from '@angular/core';

@Injectable()
export class HelpersService {

  constructor() { }

  toQueryString(obj: any) {
    var parts = [];
    for (var property in obj) {
      var value = obj[property]; // same as obj.property
      if (value != null && value != undefined) {
        parts.push(encodeURIComponent(property) + '=' + encodeURIComponent(value));
      }
    }

    return parts.join('&');
  }

}

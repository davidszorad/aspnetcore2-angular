import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'angular2-chartjs';

@Component({
  template: `
    <h1>Admin</h1>
    <chart type="pie" [data]="data"></chart>
    `
})
export class AdminComponent implements OnInit {
  data = {
    labels: ['BMW', 'Audi', 'Mazda'],
    datasets: [
      {
        data: [5, 3, 1],
        backgroundColor: [
          "#ff6798",
          "#123456",
          "#fc4433"
        ]
      }
    ]
  };

  constructor() { }

  ngOnInit() {
  }

}

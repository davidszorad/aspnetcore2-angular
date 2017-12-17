import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { ToastyModule } from 'ng2-toasty';

import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { FetchDataComponent } from './components/fetchdata/fetchdata.component';
import { CounterComponent } from './components/counter/counter.component';
import { VehicleFormComponent } from './components/vehicle-form/vehicle-form.component';
import { VehicleService } from './services/vehicle.service';
import { VehicleListComponent } from './components/vehicle-list/vehicle-list.component';
import { HelpersService } from './services/helpers.service';
import { PaginationComponent } from './components/shared/pagination/pagination.component';
import { ViewVehicleComponent } from './components/view-vehicle/view-vehicle.component';
import { PhotoService } from './services/photo.service';
import { AdminComponent } from './components/admin/admin.component';
import { AuthGuardService } from './services/auth-guard.service';
import { AdminAuthGuardService } from './services/admin-auth-guard.service';
import { AUTH_PROVIDERS } from 'angular2-jwt';

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        CounterComponent,
        FetchDataComponent,
        HomeComponent,
        VehicleFormComponent,
        VehicleListComponent,
        PaginationComponent,
        ViewVehicleComponent,
        AdminComponent
    ],
    imports: [
        CommonModule,
        HttpModule,
        ToastyModule.forRoot(),
        FormsModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'vehicles', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'counter', component: CounterComponent },
            { path: 'fetch-data', component: FetchDataComponent },
            { path: 'vehicles/new', component: VehicleFormComponent, canActivate: [ AuthGuardService ] },
            { path: 'vehicles/edit/:id', component: VehicleFormComponent, canActivate: [ AuthGuardService ] },
            { path: 'vehicles/:id', component: ViewVehicleComponent },
            { path: 'vehicles', component: VehicleListComponent },
            { path: 'admin', component: AdminComponent, canActivate: [ AdminAuthGuardService ] },
            { path: '**', redirectTo: 'home' }
        ])
    ],
    providers: [
        AdminAuthGuardService,
        AuthGuardService,
        AUTH_PROVIDERS,
        HelpersService,
        PhotoService,
        VehicleService
    ]
})
export class AppModuleShared {
}

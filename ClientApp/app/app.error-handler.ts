import { ErrorHandler, Inject, NgZone } from "@angular/core";
import { ToastyService } from "ng2-toasty";

export class AppErrorHandler implements ErrorHandler {
    // we are injecting ToastyService with @Inject decorator because ErrorHandler is loaded before TastyService in app.module.ts
    
    /* REGULAR CONSTRUCTOR
    constructor(@Inject(ToastyService) private toastyService: ToastyService) {
    }*/

    /* Constructor with zones */
    constructor(
        @Inject(NgZone) private ngZone: NgZone,
        @Inject(ToastyService) private toastyService: ToastyService) {
    }
    
    handleError(error: any): void {
        this.ngZone.run(() => {
            this.toastyService.error({
                title: 'Error',
                msg: 'An unexpected error happened.',
                theme: 'bootstrap',
                showClose: true,
                timeout: 5000 
            });
        });
    }
}
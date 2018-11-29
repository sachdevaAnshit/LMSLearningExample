import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppConfigService } from 'src/app/shared/app.config';
import { generalEventsService } from 'src/app/shared/services/generalEvents.service';

@Component({
    templateUrl: './libraryCart.component.html',
    styleUrls : ['./libraryCart.component.css']
})

export class LibraryCartComponent {
  	
	configObject : any = {};
	expressDeliveryPrice : any ;
	shoppingCartItems : any = [];
	
	constructor( private router : Router, private http: HttpClient, private appConfigService: AppConfigService, private generalEventsServiceObj : generalEventsService ) {    	
        this.configObject = this.appConfigService.getAppConfigObject(); 
    }	//end of constructor


	ngOnInit(){
		sessionStorage.redirectRoute = "/libraryCart";
		
		forkJoin(
            this.http.get( this.configObject.URLS.apiUrl + this.configObject.URLS.GETEXPRESSDELIVERYURL + sessionStorage.cwid),
            this.http.get( this.configObject.URLS.apiUrl + this.configObject.URLS.SHOPPINGCARTVIEW + sessionStorage.cwid )
        ).subscribe(([res1, res2]) => {
            this.expressDeliveryPrice = res1;
            this.shoppingCartItems = res2;
        });
	}

	changeCount(){
		this.generalEventsServiceObj.callMethodOfSecondComponent(); 
	}

	expressDelivery(){
		console.log('expressDelivery');
	}

}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Subject } from 'rxjs';
 
import { apiService } from './apiService.service';
import { AppConfigService } from 'src/app/shared/app.config';

@Injectable({
	providedIn: 'root'
})
export class generalEventsService {

	configObject : any = {};
	notificationAndCartCount : any = {};
    translations: any = {};

	constructor( private http: HttpClient, private appConfigService: AppConfigService ){
        this.configObject = this.appConfigService.getAppConfigObject();        
    };  //end of constructor

	getPostLoginDetails() : any {
		forkJoin(
            this.http.get( this.configObject.URLS.apiUrl + this.configObject.URLS.SHOPPINGCARTCOUNT + sessionStorage.cwid ),
            this.http.get( this.configObject.URLS.apiUrl + this.configObject.URLS.LIBNOTIFICATIONMASTERURL + this.configObject.URLS.CURRENTNOTIFICATIONS )
        ).subscribe(([res1, res2]) => {
            let objToReturn = {};
            /*objToReturn.cartcCount = res1;
            objToReturn.lownotificationbanner = res2["0"];
            objToReturn.highnotificationbanner = res2["1"];*/

            console.log( 'this.objToReturn  = - = [ ' + JSON.stringify(objToReturn) );

            return objToReturn;
		});
	};	//end of getPostLoginDetails

    invokeEvent: Subject<any> = new Subject();
    scrollToTopRootFunc: Subject<any> = new Subject();
    invokeTranslationChange: Subject<any> = new Subject();
    invokeAutoExtensionInChildComponent: Subject<any> = new Subject();

    callMethodOfSecondComponent() { 
        let someValue : any = {};
        someValue.cartCount = 2;
        this.invokeEvent.next(someValue);
    }

    callAppComponentScrollToTop() { 
        this.scrollToTopRootFunc.next( null );
    }

    setTranslationJSONInService( translations ){
        this.translations = translations;
    }

    getTranslationJSONFromService( ){
        return this.translations;
    }

    callToTriggerTranslationChange( passedTranslation ) { 
        this.invokeTranslationChange.next(passedTranslation);
    }

    triggerAutoExtension(routePassed){
        this.invokeAutoExtensionInChildComponent.next();
    }

};	//end of generalEventsService class
import { Injectable } from '@angular/core';
 
@Injectable({
	providedIn: 'root',
})
export class AppConfigService {
  	
	appConfigObject : any = {
		"URLS"	:	{
			"apiUrl" : "http://localhost:8080/BayerLibrary/",
//			"apiUrl" : "http://library-dev.intranet.cnb:8081/BayerLibrary/",			
			"SAVEDSEARCH" : "search/EMMJG/saved",
			"ENABLEDISABLESSOURL" : "enable-disable-sso",
			"DOCBOARDSEARCHURL" : "docboard/search",
			"UPLOADEXCELITERATURESEARCHURL" : "docboard/search/upload?cwid=",
			"LIBNOTIFICATIONMASTERURL" : "notifications",
			"CURRENTNOTIFICATIONS" : "/current",
			"GETEXPRESSDELIVERYURL" : "docboard/express-delivery-price?aCWID=",
			"SHOPPINGCARTVIEW" : "cart/",
			"SHOPPINGCARTDELETE" : "cart/",
			"SHOPPINGCARTCOUNT" : "cart/count/",
			"SHOPPINGCARTADD" : "cart?cwid=",
			"FAVBASEURL" : "favorites/",
			"ADVANCEDSEARCHYEARSDROPDOWN" : "year-options",
			"COPYRIGHTURL" : "copyrights",
			"MATRIXURL" : "/matrix",
			"EJOURNALATOZBASEURL":"ejournals/a-z?role=",
			"EJOURNALATOZSEARCHPHRASE":"&searchPhrase=",
			"EJOURNALATOZREFINETEXT":"&refineText=",
			"EJOURNALATOZOFFSET":"&offset=",
			"EJOURNALATOZLIMIT":"&limit=",
			"ADDONLINEACCESSURL" : "docboard/online-access/add",
		},
		"CONSTANTS" : {			
 		}
	};

	getAppConfigObject(){
		return this.appConfigObject;
	}
}	//end of AppConfigService
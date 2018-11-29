import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';

import { AppConfigService } from 'src/app/shared/app.config';
import { apiService } from 'src/app/shared/services/apiService.service';
import { generalEventsService } from 'src/app/shared/services/generalEvents.service';

@Component({
    templateUrl: './mySavedSearches.component.html',
    styleUrls : ['./mySavedSearches.component.css']
})

export class MySavedSearchesComponent {
  
    savedSearches : any = {}
    Object = Object;
    configObject : any = {};

    constructor( private router : Router, private http: HttpClient, private appConfigService: AppConfigService, private apiServiceObj : apiService, private generalEventsServiceObj : generalEventsService ) {    	
        this.configObject = this.appConfigService.getAppConfigObject(); 
    }	//end of constructor

    ngOnInit(){
        sessionStorage.redirectRoute = "/mySavedSearches";
        this.http.get( this.configObject.URLS.apiUrl + this.configObject.URLS.SAVEDSEARCH ).subscribe(resp => {
      		this.savedSearches = resp;
    	});
    }	//end of ngOnInit

    deleteNamedSearch(event, passedSearchObject){
        console.log('deleteNamedSearch = ' + JSON.stringify(passedSearchObject.searchId));
    }   //end of deleteNamedSearch
    
    reRunQuery(event, passedSearchObject){
        var parsedSearchQuery = JSON.parse( passedSearchObject.searchQuery);
        parsedSearchQuery.offset = 0;
        parsedSearchQuery.limit = 20;
        delete parsedSearchQuery.cwid;
        this.router.navigateByUrl('/searchresults/' + JSON.stringify( parsedSearchQuery ).replace(/\//g,"_"));
    }   //end of reRunQuery
  
    scrollTop(){
        this.generalEventsServiceObj.callAppComponentScrollToTop();
    }
}
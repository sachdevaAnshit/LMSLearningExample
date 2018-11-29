import { Component } from '@angular/core';
import { Router  } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppConfigService } from 'src/app/shared/app.config';

@Component({
	templateUrl: './eJournalAZ.component.html',
	styleUrls : ['./eJournalAZ.component.css']
})

export class EJournalAZComponent {
   
    configObject : any = {};
    //Config object for autocomplete
    config2: any = {};

    arrayOfAlphabets : any = [];
    searchPhrase : string = "";
    eJournalAToZResults : any = {};
    refineText : string = "";
    autoCompleteSuggestionsObj : any = {};

    constructor( private http: HttpClient, private appConfigService: AppConfigService ){
        this.configObject = this.appConfigService.getAppConfigObject();        
    };  //end of constructor

    ngOnInit(){
        sessionStorage.redirectRoute = "/eJournalAZ";
        
        this.arrayOfAlphabets = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
        this.searchPhrase = this.arrayOfAlphabets[0];

        this.getEJournalTitles( this.searchPhrase );
        this.autoCompleteSuggestionsObj.refineText = [];
    };  //end of ngOnInit

    getEJournalTitles( phraseSelected ){
        this.searchPhrase = phraseSelected;
        this.refineText = "";

        this.http.get( this.configObject.URLS.apiUrl + this.configObject.URLS.EJOURNALATOZBASEURL + sessionStorage.role + this.configObject.URLS.EJOURNALATOZSEARCHPHRASE + this.searchPhrase + this.configObject.URLS.EJOURNALATOZOFFSET + 0 + this.configObject.URLS.EJOURNALATOZLIMIT + 24 ).subscribe(resp => {
            this.eJournalAToZResults = resp;
        });        
    };  //end of getEJournalTitles

    getAutosuggestions(val, keyPassed) {
        if( val.length >= 3 ){
            this.http.get( this.configObject.URLS.apiUrl + 'suggestions?source=EJOURNAL&searchPhrase=' + encodeURIComponent(val) + '&field=a_z_search&limit=20&contextFilter=' + this.searchPhrase
            ).subscribe(resp => {
                console.log('got autosuggestions');
                this.autoCompleteSuggestionsObj[keyPassed] = resp;
            });
        }else{
            this.autoCompleteSuggestionsObj[keyPassed] = [];
        }
    };  //end of getAutosuggestions

    refineSearch(){
        let urlToHit : string = this.configObject.URLS.apiUrl + this.configObject.URLS.EJOURNALATOZBASEURL + sessionStorage.role + this.configObject.URLS.EJOURNALATOZOFFSET + 0 + this.configObject.URLS.EJOURNALATOZLIMIT + 24 + this.configObject.URLS.EJOURNALATOZSEARCHPHRASE + this.searchPhrase;
        urlToHit = (this.refineText == "undefined" || this.refineText == null || typeof this.refineText == undefined) ? urlToHit : urlToHit + this.configObject.URLS.EJOURNALATOZREFINETEXT + encodeURIComponent(this.refineText);

        this.http.get( urlToHit ).subscribe(resp => {
            this.eJournalAToZResults = resp;
        });
    };  //end of refineSearch
}
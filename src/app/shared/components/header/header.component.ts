import { Component , Input, SimpleChanges, ViewEncapsulation} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';

import { AppConfigService } from 'src/app/shared/app.config';
import { generalEventsService } from 'src/app/shared/services/generalEvents.service';

import $ from 'jquery';

@Component({
	templateUrl: './header.component.html',
	styleUrls : ['./header.component.css'],
	selector: 'header-component',
    encapsulation: ViewEncapsulation.None
})

export class HeaderComponent {
	
    //Object holding translations
    translations : any = {};
    //Flag to control the visiblity of Normal Search Section
    toggle_flag : number = 0;
    //Array holding the sources being checked by the user
    sourcesChecked : any = ["EBOOK","EJOURNAL"];
    //Main search query model & its metadata field
    searchQuery : string = "";
    selectedSearchCriteria : string = "allText";
    selectedSearchPhrase : string = "";
    language : string;
    timeSpanRange : boolean;
    fromYear : boolean;
    toYear : boolean;
    advancedSearchYearDropdown : any = [];
    //Config object for autocomplete
    config2: any = {};
    //Configobject holding the configuration for the application
    configObject : any = {};
    //Object holding the search object
    searchObject : any = {};
    //Array holding advanced search objects
    choices : any = [];

    //Object holding autocomplete suggestions for each of input    
    autoCompleteSuggestionsObj : any = {};

    //Assumed list of metadata fields
    listOfMetaFields : any = ["allText","authorEditor","title","bookTitle","journalTitle","year","subject","isbn","issn","documentIdentifier","keywords","sourceAdditionalInfomation","language","publisher"];

    @Input("ssoValue") ssoValue : boolean;
    @Input("notificationAndCartCount") notificationAndCartCount : any;

    constructor( private router : Router, private http: HttpClient, private appConfigService: AppConfigService, private generalEventsServiceObj : generalEventsService ){
        router.events.forEach((event) => {
            if(event instanceof NavigationEnd) {
                this.toggle_flag = 0;
                console.log('toggle zero');
            }
        });
        this.configObject = this.appConfigService.getAppConfigObject();
        this.searchObject = {
            "searchPhrase" : "",
            "criteria" : "allText",
            "advancedSearchOptions" : []
        };
        this.autoCompleteSuggestionsObj.searchQuery = [];
        this.autoCompleteSuggestionsObj.first = [];        
    }
    
    ngOnInit(){
        this.translations = this.generalEventsServiceObj.getTranslationJSONFromService();
        
        this.generalEventsServiceObj.invokeTranslationChange.subscribe(value => {
            this.translations = value;
            console.log('header commponent subscribe event = ' + value.navbarDocumentOrder);
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let propName in changes) {
            let change = changes[propName];
            if( propName === "ssoValue"){
                this.ssoValue = change.currentValue;
            }else if( propName === "notificationAndCartCount"){
                this.notificationAndCartCount = change.currentValue;
            }           
        }
    };  //end of ngOnChanges
	triggerSearch(){
    	if( this.toggle_flag == 0){    this.toggle_flag = 1;   }else{  	this.toggle_flag = 0;  	};

        this.searchQuery = "";
        this.choices = [];
        this.language = "English";
        this.toYear = null;
        this.fromYear = null;
        this.timeSpanRange = false;
        this.selectedSearchPhrase = null;
        this.selectedSearchCriteria = "allText";

        var getAdvSearchYearObj = {
            searchPhrase:"*", sources: this.sourcesChecked, cwid:sessionStorage.cwid
        };
        // To hit service for Years only it the section is slided down
        if( this.toggle_flag == 1 ){
            this.http.post( this.configObject.URLS.apiUrl + this.configObject.URLS.ADVANCEDSEARCHYEARSDROPDOWN, getAdvSearchYearObj  ).subscribe((resp : any) => {
                this.advancedSearchYearDropdown = resp.year;                
            });
        }else{
            console.log('tggl flaf else');
            $(".advancedSearchSection").removeClass("in");
        }

        let defaultLength = 2;
        for( var i=1; i <= defaultLength ; i++){
            this.choices.push( {
                "criteria": this.listOfMetaFields[i],
                "operation": "AND",
                "searchPhrase" : ""
                }
            );
            this.autoCompleteSuggestionsObj[i-1] = [];
        }   //end of making default number of additional fields
    }
    sourcesCheckEvent( source ){
        this.sourcesChecked.indexOf(source) == -1 ? this.sourcesChecked.push(source) : this.sourcesChecked.splice( this.sourcesChecked.indexOf(source), 1);
        console.log('this.sourcesChecked = ' + this.sourcesChecked);
    };  //end of sourcesCheckEvent
    carrySearch(){
        let searchObj = {
            "searchPhrase" : this.searchQuery,
            "sources" : this.sourcesChecked,
            "refineText" : "",
            "sortType" : "RELEVANCE",
            "offset" : 0,
            "limit" : 24,
            "pagedResults" : false,
            "role" : "ADMIN",
            "cwid" : sessionStorage.cwid,
            "isAdvancedSearch" : false
        };
        this.router.navigateByUrl('/searchresults/' + JSON.stringify(searchObj).replace(/\//g,"_"));
    };  //end of carrySearch
    submitNormalSearch(){
        let searchObj = {
            "searchPhrase" : this.searchQuery,
            "sources" : this.sourcesChecked,
            "refineText" : "",
            "sortType" : "RELEVANCE",
            "offset" : 0,
            "limit" : 24,
            "pagedResults" : false,
            "role" : "ADMIN",
            "cwid" : sessionStorage.cwid,
            "isAdvancedSearch" : false
        };
        this.router.navigateByUrl('/searchresults/' + JSON.stringify(searchObj).replace(/\//g,"_"));
    }
    ssoChanged(evt){
        let jsonForSSO =  {      
            "cwid" : sessionStorage.cwid,
            "enableDisableFlag" : (evt == true) ? 1 : 0
        };
        this.http.post( this.configObject.URLS.apiUrl + this.configObject.URLS.ENABLEDISABLESSOURL, jsonForSSO   ).subscribe(resp => {
        });
    }
    onSelect(item: any) {
        alert('value selected = '  + item);
    };  //end of onSelect
    onInputChangedEvent(val: string, sources : any, metaField, keyPassed) {
        if( val.length >= 3 ){
            let sourcesAsParam = "", i;
            for( i=0; i< sources.length; i++ ) {
                sourcesAsParam += "&source=" + sources[i];
            }
            this.http.get( this.configObject.URLS.apiUrl + 'suggestions?searchPhrase=' + val + "&limit=20" + "&field=" + metaField + sourcesAsParam).subscribe(resp => {
                this.autoCompleteSuggestionsObj[keyPassed] = resp;
            });
        }else{
            this.autoCompleteSuggestionsObj[keyPassed] = [];
        }
    };  //end of onInputChangedEvent
    addAutoComplete(){
        let objToPushInAutoComplete = {
            "searchPhrase" : "",
            "criteria" : this.listOfMetaFields[ this.choices.length + 1],
            "operation" : "AND",
        };
        this.autoCompleteSuggestionsObj[ this.choices.length ] = [];
        this.choices.push( objToPushInAutoComplete );
    };   //end of addAutoComplete
    spliceAdvancedSearchOptions( indexPassed ){
        this.choices.splice(indexPassed,1);
    };  //end of spliceAdvancedSearchOptions

    getLanguageTranslations( selectedLanguage ){
        this.notificationAndCartCount.selectedLanuage = selectedLanguage;
        this.http.get('assets/translations/' + selectedLanguage + '.json').subscribe((resp:any) => {
            this.translations = resp;
            //Set translation in Service to be available for all components
            this.generalEventsServiceObj.setTranslationJSONInService( resp );
            //Trigger event for all components to capture changed translation
            console.log('header language changed ' + resp.navbarDocumentOrder);
            this.generalEventsServiceObj.callToTriggerTranslationChange( resp );
        });
    }
}
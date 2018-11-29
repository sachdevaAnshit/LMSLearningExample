import { Component, TemplateRef, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpHeaders } from '@angular/common/http';

import { AppConfigService } from 'src/app/shared/app.config';
import { generalEventsService } from 'src/app/shared/services/generalEvents.service';

import * as FileSaver from 'file-saver';

import { Location } from '@angular/common';

import { apiService } from 'src/app/shared/services/apiService.service';

@Component({
	templateUrl: './searchResult.component.html',
	styleUrls : ['./searchResult.component.css']
})

export class SearchResultComponent {
  	
  	Object = Object;
	jsonData : any = {};	
	searchString : string;
	searchResultsData : any = {};
	showOriginalHeader : boolean;
	layout : string;
	sortFilterModel : string;
	configObject : any = {};
	searchResultDownloadType : string = "SELECTED";
	downloadLinksObject : any = {
	    selectedValues: [],
		displayCheckbox: false
	};
    dataToExportExcel : any = {
        "ebookDocuments": [],
        "pubmedDocuments": [],
        "ejournalDocuments": [],
        "crossrefDocuments": []
    };

  	constructor(    private route: ActivatedRoute, 
                    private http: HttpClient, 
                    private appConfigService: AppConfigService, 
                    private generalEventsServiceObj : generalEventsService,
                    private location: Location, 
                    private apiServiceObj : apiService) { 
  		this.configObject = this.appConfigService.getAppConfigObject();
  		this.showOriginalHeader = true; 
  		this.layout = "list";
  	};	//end of constructor

	ngOnInit() {
		this.route.params.subscribe( params =>{
            this.jsonData = JSON.parse( params['jsonData'] );
            //alert('jsonData = ' + params['jsonData']);
            sessionStorage.redirectRoute = '/searchresults/' + JSON.stringify( this.jsonData );
            this.http.post( this.configObject.URLS.apiUrl + 'search', this.jsonData  ).subscribe(resp => {
	      		this.searchResultsData = resp;
	      		this.searchString = this.jsonData.displayText != null? this.jsonData.displayText : this.jsonData.searchPhrase;
                // Preserve the sorting dropdown
                this.sortFilterModel = this.jsonData.sortType;
	      		if( this.jsonData.filters == null || this.jsonData.filters == undefined) {
		      		this.jsonData.filters = {
		      			"journalTitle":[],"bookTitle":[],"authorEditor":[],"year":[],"subject":[],"keywords":[],"language":[],"publicationType":[],"publisher":[],"location":[],"available":[]	
		      		}
		      	}
                this.location.go('/searchresults/' + JSON.stringify( this.jsonData ));
	    	});
		});
        this.generalEventsServiceObj.invokeAutoExtensionInChildComponent.subscribe(value => {
            console.log('got in child component on scroll atuo-extension');
        });
	};	//end of ngOnInit
	
	hitFilterApi( objInParent ){
		this.jsonData = JSON.parse( JSON.stringify( objInParent.objFromFilterMgmtoParent ) );
		this.jsonData.offset = 0;
	    this.jsonData.limit = 24;
	    this.jsonData.sortType = this.sortFilterModel;

	    this.http.post( this.configObject.URLS.apiUrl + 'search', this.jsonData  ).subscribe(resp => {
	    	let keysArray, newArray, oldArray, outerCounter, innerCounter, oldArrayKeys, preservedSearchResultsData;
      		preservedSearchResultsData = JSON.parse( JSON.stringify( this.searchResultsData ) );
      		this.searchResultsData = resp;
      		switch( objInParent.keyChanged ){
      			case "SORTINGSEARCHDATA" : 
      				console.log('SORTINGSEARCHDATA');
      				break;
      			default :
      				keysArray = Object.keys(this.jsonData.filters);
      				for( outerCounter = 0; outerCounter < keysArray.length ; outerCounter++ ){
      					if( keysArray[outerCounter] == objInParent.keyChanged && 
      						this.jsonData.filters[ keysArray[outerCounter] ].length != 0) {
      						this.searchResultsData.searchFacets[ keysArray[outerCounter] ] = preservedSearchResultsData.searchFacets[ keysArray[outerCounter] ];
	                    }
	                    else{
	                    	newArray = this.searchResultsData.searchFacets[ keysArray[outerCounter] ];
	                        oldArray = preservedSearchResultsData.searchFacets[ keysArray[outerCounter] ];

	                        newArray = (newArray == null || newArray == undefined) ? [] : newArray;
	                        oldArray = (oldArray == null || oldArray == undefined) ? [] : oldArray;

	                        oldArrayKeys = Object.keys( oldArray );
	                        for( innerCounter = 0; innerCounter < oldArrayKeys.length; innerCounter++ ){
	                        	if( oldArray[ oldArrayKeys[innerCounter] ].selected && this.checkFilterPresence( oldArray[ oldArrayKeys[innerCounter] ], newArray)) {
	                        		oldArray[ oldArrayKeys[innerCounter] ].count = 0;
	                                newArray.push( oldArray[ oldArrayKeys[innerCounter] ] );
	                            }
	                        }
	                        this.searchResultsData.searchFacets[ keysArray[outerCounter] ] = newArray;
	                    }
      				}
      				break;
      		};	//end of switch
            this.location.go('/searchresults/' + JSON.stringify( this.jsonData ));
    	});
	};	//end of hitFilterApi

	showDownloadWrapperToggle() {
        this.showOriginalHeader = !this.showOriginalHeader;
		//CLear the array and set dropdown to selected on each toggle
		this.downloadLinksObject.selectedValues = [];
        this.downloadLinksObject.displayCheckbox = !this.downloadLinksObject.displayCheckbox;
		this.searchResultDownloadType = "SELECTED";
	};	//end of showDownloadWrapperToggle

	changeLayout( passedLayout ) {
		this.layout = passedLayout;
	};	//end of changeLayout

	checkFilterPresence( elem, newArray) {
		var returnValue = false;
		for( var i=0; i < newArray.length; i++ ){
			if( newArray[i].value == elem.value ){
				returnValue = true;
			}
		}
		//return returnValue;
	};	//end of checkFilterPresence
  	    
	downloadExportExcel(){
		this.dataToExportExcel.cwid = sessionStorage.cwid;
        this.dataToExportExcel.ebookDocuments = this.downloadLinksObject.selectedValues.filter(function(data) {
            return data.widgetType === "eBook"
        });
        this.dataToExportExcel.pubmedDocuments = this.downloadLinksObject.selectedValues.filter(function(data) {
            return data.widgetType === "pubmed"
        });
        this.dataToExportExcel.ejournalDocuments = this.downloadLinksObject.selectedValues.filter(function(data) {
            return data.widgetType === "eJournal"
        });
        this.dataToExportExcel.crossrefDocuments = this.downloadLinksObject.selectedValues.filter(function(data) {
            return data.widgetType === "crossref"
        });
        let changedDownloadObject = JSON.parse( JSON.stringify( this.dataToExportExcel ));

        switch( this.searchResultDownloadType ){
            case "SELECTED" : 
                changedDownloadObject.searchDtls = null;
                break;
            default : 
                let tempSearchObj = JSON.parse( JSON.stringify( this.jsonData ));
                changedDownloadObject.ebookDocuments = changedDownloadObject.pubmedDocuments = changedDownloadObject.ejournalDocuments = changedDownloadObject.crossrefDocuments = [];
                tempSearchObj.offset = 0;
                tempSearchObj.limit = this.searchResultDownloadType === "PAGE" ? this.searchResultsData.documents.length : this.searchResultDownloadType;
                changedDownloadObject.searchDtls = tempSearchObj;
        };  //end of switch
        changedDownloadObject.role = "ADMIN";
		this.apiServiceObj.downloadBlobExcel( this.configObject.URLS.apiUrl + 'download', changedDownloadObject).subscribe((resp:any) => {
            let blob = new Blob([resp], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            let fileName = sessionStorage.cwid + "_Search_Results.xlsx";
            FileSaver.saveAs(blob,fileName );
            this.searchResultDownloadType = "SELECTED";
            this.showOriginalHeader = true;
            this.downloadLinksObject = {
                selectedValues: [],
                displayCheckbox: false
            };
            this.dataToExportExcel = {
                "ebookDocuments": [],
                "pubmedDocuments": [],
                "ejournalDocuments": [],
                "crossrefDocuments": []
            };
        },
        (err:any) => {
            console.log(JSON.stringify(err));

        });;
	};	//end of downloadExportExcel

    sortChanged(){
        this.jsonData.sortType = this.sortFilterModel;
        let objToPassToParent = {
            keyChanged : "SORTINGSEARCHDATA",
            objFromFilterMgmtoParent : JSON.parse( JSON.stringify(this.jsonData) )
        };
        this.hitFilterApi( objToPassToParent );
    };  //end of sortChanged

}
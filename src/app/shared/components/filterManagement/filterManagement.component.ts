import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { SaveSearchComponent } from 'src/app/shared/modal/saveSearch/saveSearch.component';

@Component({
    selector: 'filter-management',
    templateUrl: './filterManagement.component.html',
})
 
export class FilterManagementComponent implements OnInit {
    
	Object = Object;
	@Input() searchresultsfilterdata: any;
	@Input() searchobject : any;
	@Output() hitfilterapiinparent = new EventEmitter();
	oneAtATime: boolean = true;
	bsModalRef: BsModalRef;
	search : any = {
		"journalTitle" : "",
		"bookTitle" : "", 
		"authorEditor": "",
		"year" : "",
		"subject" : "",
		"keywords" : "",
		"language" : "",
		"publicationType" : "",
		"publisher" : "",
		"location" : "",
		"available" : ""
	};
	refineText : string = "";

    constructor( private modalService: BsModalService ) {
    }
 
    ngOnInit() {}

    getKeyOutPutValue( keyPassed ){
    	return keyPassed != 'authorEditor' ? keyPassed : "Author/Editor";
    };	//end of getKeyOutPutValue

    getCheckedStatus( sourcePassed ){
    	return this.searchobject.sources.indexOf(sourcePassed) != -1;
    };	//end of getCheckedStatus

    getDisabledCheck( sourcePassed ){
    	return (this.searchobject.sources.length == 1  && this.searchobject.sources.indexOf(sourcePassed) == 0);
    };	//end of getDisabledCheck

    checkBoxEvent( key, model, isChecked ){
    	let values, idx, objToPassToParent;
    	switch( key ){
	    	case "sources" :
	    		values = this.searchobject.sources;
	    		idx = values.indexOf(model);
				switch( values.indexOf(model)  ){
					case -1 : 
						this.searchobject.sources.push(model);
						break;
					default : 
						//pop the value
						values.splice( idx , 1 );
						this.searchobject.sources = values;
						break;
				}
				break;
	    	default :
    		values = this.searchobject.filters[key];
			switch( isChecked ){
				case true:
					if ( this.searchobject.filters[key] !== undefined || this.searchobject.filters[key] !== null) {
						values.push(model);
						this.searchobject.filters[key] = values;
					} else {
						this.searchobject.filters[key] = model;
					}
					break;
				case false:
					values = this.searchobject.filters[key];
					values.splice(values.indexOf(model) ,1);
					//To uncheck the selected property of the filter unselected via the new DIV present above the results
					for( var i = 0; i < this.searchobject.filters[key].length; i++  ){
						if( this.searchobject.filters[key][i].value == model ){
							this.searchobject.filters[key][i].selected = false;
						}
					}
					break;
			}
    		break;
    	};	//end of switch
    	// objToPassToParent with key changed and updated obj after checkboxes event
    	objToPassToParent = {};
    	objToPassToParent.keyChanged = key;
    	objToPassToParent.objFromFilterMgmtoParent = JSON.parse( JSON.stringify(this.searchobject) );

    	this.hitfilterapiinparent.emit( objToPassToParent );
    };	//end of checkBoxEven

    saveSearch(){
    	const initialState = {
            saveSearchObject : this.searchobject
        };	
        this.bsModalRef = this.modalService.show(SaveSearchComponent, {initialState});   
        this.bsModalRef.content.saveSearchCallbackFunction.subscribe((value) => {
            console.log('saveSearch  back - ' + value);
        });
        this.bsModalRef.content.saveSearchClosedExplicitly.subscribe((value) => {
            console.log('saveSearchClosedExplicitly back - ' + value);
        });
    };	//end of saveSearch

    filterOutSelectedStatus( passedFiltersArray ){
    	let arrayToCheck = JSON.parse( JSON.stringify(passedFiltersArray) );
    	let result = [];

    	for(let i=0;i<arrayToCheck.length;i++){
    		if( arrayToCheck[i].selected ){
    			result.push( arrayToCheck[i] );
    		}
    	}
    	return result;
    };
    
    filterOutUnSelectedStatus( passedFiltersArray ){
    	let arrayToCheck = JSON.parse( JSON.stringify(passedFiltersArray) );
    	let result = [];

    	for(let i=0;i<arrayToCheck.length;i++){
    		if( !arrayToCheck[i].selected ){
    			result.push( arrayToCheck[i] );
    		}
    	}
    	return result;
    };
    
    clearAllFilters(){
    	//Clear all the filters and hit search service to get the results once again.
		this.refineText= "";
		this.searchobject.refineText = "";
		this.searchobject.offset = 0;
		this.searchobject.limit = 24;		
		this.searchobject.filters = {
			"journalTitle":[],"bookTitle":[],"authorEditor":[],"year":[],"subject":[],"keywords":[],"language":[],"publicationType":[],"publisher":[],"location":[],"available":[]
		}
		let objToPassToParent;
		objToPassToParent = {};
    	objToPassToParent.keyChanged = null;
    	objToPassToParent.objFromFilterMgmtoParent = JSON.parse( JSON.stringify(this.searchobject) );

    	this.hitfilterapiinparent.emit( objToPassToParent );
    };	//end of clearAllFilters

    searchFromRefineSearch(){
    	this.searchobject.refineText  = this.refineText;
    	//Keeping everything same in searchobject
    	let objToPassToParent;
		objToPassToParent = {};
    	objToPassToParent.keyChanged = null;
    	objToPassToParent.objFromFilterMgmtoParent = JSON.parse( JSON.stringify(this.searchobject) );

    	this.hitfilterapiinparent.emit( objToPassToParent );
    };	//end of refineSearch
}

@Component({
    selector: 'filters-as-tiles',
    templateUrl: './filtersAsTiles.component.html',
})
 
export class FilterAsTilesComponent {
	
	Object = Object;
	@Input() searchresultsfilterdata: any;
	@Input() searchobject : any;
	@Output() hitfilterapiinparent = new EventEmitter();

	constructor(){
	}
	checkBoxEvent( key, model, isChecked ){
    	let values, idx, objToPassToParent;
    	switch( key ){
    	case "sources" :
    		console.log('this.searchobject.sources = ' + this.searchobject.sources);
    		break;
    	default :
    		values = this.searchobject.filters[key];
			switch( isChecked ){
				case true:
					if ( this.searchobject.filters[key] !== undefined || this.searchobject.filters[key] !== null) {
						values.push(model);
						this.searchobject.filters[key] = values;
					} else {
						this.searchobject.filters[key] = model;
					}
					break;
				case false:
					values = this.searchobject.filters[key];
					values.splice(values.indexOf(model) ,1);
					//To uncheck the selected property of the filter unselected via the new DIV present above the results
					/*angular.forEach(scope.searchresultsfilterdata.searchFacets[key],function(elem,keyIteration){
						if(elem.value == model){
							elem.selected = CONSTANTS.getCONSTANTS().FALSE;
						}
					});*/
					break;
			}
    		break;
    	};	//end of switch
    	// objToPassToParent with key changed and updated obj after checkboxes event
    	objToPassToParent = {};
    	objToPassToParent.keyChanged = key;
    	objToPassToParent.objFromFilterMgmtoParent = JSON.parse( JSON.stringify(this.searchobject) );

    	this.hitfilterapiinparent.emit( objToPassToParent );
    };	//end of checkBoxEvent

}
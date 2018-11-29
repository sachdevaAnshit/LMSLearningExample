import { Component, OnInit, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { AppConfigService } from 'src/app/shared/app.config';

@Component({
	selector : 'bayer-grid-view',
	templateUrl: './bayerGrid.component.html',
	styleUrls : ['./bayerGridList.component.css']
})

export class BayerGridComponent {
  	
    @Input() downloadlinksobject : any;
    @Input() passeddata : any;
    @Input() excelobject : any;
    @Output() getFavData = new EventEmitter();

    configObject : any = {};

  	constructor( private router : Router, private http : HttpClient, private appConfigService: AppConfigService ) {
        this.configObject = this.appConfigService.getAppConfigObject(); 
    };  //end of constructor
    ngOnInit(){
        if( this.router.url === "/myFavorites"){
            this.passeddata.isFavorite = true;
        }
    }
    ngOnChanges(changes: SimpleChanges) {
        for (let propName in changes) {
            let change = changes[propName];
            if( propName === "downloadlinksobject"){
                this.downloadlinksobject = change.currentValue;
            }else if( propName === "passeddata"){
                this.passeddata = change.currentValue;
            }          
        }
    }
    downloadValueChanged( changedData ){
        if(this.downloadlinksobject.selectedValues.indexOf( changedData )==-1){
            this.downloadlinksobject.selectedValues.push( changedData );
        }
        else{
            this.downloadlinksobject.selectedValues.splice(this.downloadlinksobject.selectedValues.indexOf( changedData ),1);
        }
    };  //end of downloadValueChanged
    favToggle( favIconObject ){
        let favObject = {"cwid" : sessionStorage.cwid , "widgetType": favIconObject.widgetType,"documentId" : favIconObject.documentId};
        if( favIconObject.isFavorite ){
            this.http.post( this.configObject.URLS.apiUrl + this.configObject.URLS.FAVBASEURL, favObject  ).subscribe(resp => {
                console.log('Added');
            });
        }else{
            let options = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                }),
                body: favObject,
            };
            this.http.delete( this.configObject.URLS.apiUrl + this.configObject.URLS.FAVBASEURL, options  ).subscribe(resp => {
                console.log('deleted');
                this.getFavData.emit();
            });
        }        
    }
}

@Component({
	selector : 'bayer-list-view',
	templateUrl: './bayerList.component.html',
	styleUrls : ['./bayerGridList.component.css']
})

export class BayerListComponent {

    @Input() downloadlinksobject : any;
    @Input() passeddata : any;
    @Input() excelobject : any;
  	@Output() getFavData = new EventEmitter();

    configObject : any = {};

  	constructor( private router : Router, private http : HttpClient, private appConfigService: AppConfigService ) {
        this.configObject = this.appConfigService.getAppConfigObject(); 
    };  //end of constructor
    ngOnInit(){
        if( this.router.url === "/myFavorites"){
            this.passeddata.isFavorite = true;
        }
    }
    ngOnChanges(changes: SimpleChanges) {
        for (let propName in changes) {
            let change = changes[propName];
            if( propName === "downloadlinksobject"){
                this.downloadlinksobject = change.currentValue;
            }else if( propName === "passeddata"){
                this.passeddata = change.currentValue;
            }          
        }
    }    
    downloadValueChanged( changedData ){
        if(this.downloadlinksobject.selectedValues.indexOf( changedData )==-1){
            this.downloadlinksobject.selectedValues.push( changedData );
        }
        else{
            this.downloadlinksobject.selectedValues.splice(this.downloadlinksobject.selectedValues.indexOf( changedData ),1);
        }
    };  //end of downloadValueChanged    
    favToggle( favIconObject ){
        let favObject = {"cwid" : sessionStorage.cwid , "widgetType": favIconObject.widgetType,"documentId" : favIconObject.documentId};
        if( favIconObject.isFavorite ){
            this.http.post( this.configObject.URLS.apiUrl + this.configObject.URLS.FAVBASEURL, favObject  ).subscribe(resp => {
                console.log('Added');
            });
        }else{
            let options = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                }),
                body: favObject,
            };
            this.http.delete( this.configObject.URLS.apiUrl + this.configObject.URLS.FAVBASEURL, options  ).subscribe(resp => {
                console.log('deleted');
                this.getFavData.emit();
            });
        }        
    }
}
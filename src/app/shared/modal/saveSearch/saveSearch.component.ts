import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient  } from '@angular/common/http';

import { AppConfigService } from 'src/app/shared/app.config';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

//import { BsModalService } from 'ngx-bootstrap/modal';
//import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  templateUrl: './saveSearch.component.html',
  styleUrls : ['./saveSearch.component.css']
})

export class SaveSearchComponent {

  
    configObject : any = {};
    searchName : string;
    saveSearchObject : any = {};
    @Output() saveSearchCallbackFunction = new EventEmitter();
    @Output() saveSearchClosedExplicitly = new EventEmitter();

    constructor( private http: HttpClient, private appConfigService: AppConfigService, public bsModalRef: BsModalRef ) {    	
        this.configObject = this.appConfigService.getAppConfigObject(); 
    }	//end of constructor

    ngOnInit(){
    }	//end of ngOnInit

    saveSearchForUser(){
        this.http.post( this.configObject.URLS.apiUrl + 'search/' + sessionStorage.cwid + "/saved/" + this.searchName , this.saveSearchObject).subscribe(resp => {
            this.saveSearchCallbackFunction.emit("SAVESEARCHSUCCESS");
            this.bsModalRef.hide();    
        });
    };  //end of saveSearchForUser


    closeModal( reason : string ){
        //Callback function to pass data from modal to parent component where modalCallbackFunction is captured
        this.saveSearchClosedExplicitly.emit(reason);
        this.bsModalRef.hide();
    };  //end of closeModal
}
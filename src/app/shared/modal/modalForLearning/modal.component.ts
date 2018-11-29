import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

//import { BsModalService } from 'ngx-bootstrap/modal';
//import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
    selector: 'modal-content',
    templateUrl: './modal.component.html',
})
 
export class ModalContentComponent implements OnInit {
    title: string;
    closeBtnName: string;
    list: any[] = [];
    page : string;
    type : string;
 
    @Output() modalCallbackFunction = new EventEmitter();
    
    constructor(private http: HttpClient, public bsModalRef: BsModalRef) {
    }
 
    ngOnInit() {
        this.list.push('PROFIT!!!');
        console.log('page = ' + this.page);
        console.log('type = ' + this.type);
    }

    closeModal( reason : string ){
        console.log('reason in   ModalContentComponent ' + reason);
        if( reason == "DONE" ){
            //Callback function to pass data from modal to parent component where modalCallbackFunction is captured
            this.modalCallbackFunction.emit(reason);
        }        
        this.bsModalRef.hide();
    }

}
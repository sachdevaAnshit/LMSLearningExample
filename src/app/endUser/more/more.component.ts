import { Component, ViewEncapsulation, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ModalContentComponent } from 'src/app/shared/modal/modalForLearning/modal.component';

@Component({
    templateUrl: './more.component.html',
    styleUrls : ['./more.component.css'],
    encapsulation: ViewEncapsulation.None,
})

export class MoreComponent {
  
    glossaryData : any = {};    

    modalRef: BsModalRef;
    bsModalRef: BsModalRef;

	constructor( private modalService: BsModalService, private http: HttpClient ) {   	
    }	//end of constructor

    ngOnInit(){
      sessionStorage.redirectRoute = "/more";
    	this.http.get("http://localhost:8080/BayerLibrary/glossary").subscribe(resp => {
      		this.glossaryData = resp;
    	});
    };	//end of ngOnInit

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);        
    };  //end of openModal

    openModalWithComponent(page,type) {
        const initialState = {
            list: [
                'Open a modal with component',
                'Pass your data',
                'Do something else',
                '...'
            ],
            title: 'Modal with component',
            page : page,
            type : type
        };  
        this.bsModalRef = this.modalService.show(ModalContentComponent, {initialState});
        this.bsModalRef.content.closeBtnName = 'Close';
        this.bsModalRef.content.modalCallbackFunction.subscribe((value) => {
            console.log('homeComponent - ' + value);
        });
    };  //end of openModalWithComponent
   
}
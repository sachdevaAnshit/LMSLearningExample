import { Component, TemplateRef, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import $ from 'jquery';

import { AppConfigService } from 'src/app/shared/app.config';
import { generalEventsService } from 'src/app/shared/services/generalEvents.service';

@Component({
    templateUrl: './home.component.html',
    styleUrls : ['./home.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class HomeComponent {
  	
    translations : any = {};

    formObj : any = {};

    configObject : any = {};
    
    abc : string = "";
    def : string = "";
    conditionalReqSubmitted : boolean = false;

    form: FormGroup;
    payLoad = '';

	constructor(private router : Router, private http: HttpClient, private appConfigService: AppConfigService, private generalEventsServiceObj : generalEventsService) {
        this.configObject = this.appConfigService.getAppConfigObject();
    };  //end of constructor
	 
    ngOnInit(){
        sessionStorage.redirectRoute = "/home";
        
        this.translations = this.generalEventsServiceObj.getTranslationJSONFromService();
        
        this.generalEventsServiceObj.invokeTranslationChange.subscribe(value => {
            this.translations = value;
            console.log('home commponent subscribe event = ' + value.navbarDocumentOrder);
        });
    };  //end of ngOnInit

    onSubmit( formRef ){
        alert('onSubmit' + formRef.form.valid);
    };  //end of onSubmit

    onSubmitConditionalReq( formRef ){
        this.conditionalReqSubmitted = true;
        if( formRef.form.valid ){
            console.log('valid');
        }else{
            Object.keys(formRef.form.controls).forEach(field => {
                const control = formRef.form.get(field);      
                control.markAsTouched({ onlySelf: true });
            });
        }
    };  //end of onSubmitConditionalReq   
    
}
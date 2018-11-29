import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

import { AppConfigService } from 'src/app/shared/app.config';
import { apiService } from 'src/app/shared/services/apiService.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls : ['./login.component.css']
})

export class LoginComponent {

    configObject : any = {};
    user : any = {};
    authenticationError : boolean;

	constructor( private router : Router, private http: HttpClient, private appConfigService: AppConfigService ){
        this.configObject = this.appConfigService.getAppConfigObject();
	};	//end of constructor

	ngOnInit(){
		this.authenticationError = false;
	};	//end of ngOnInit

    submitLoginForm(){
        this.http.post( this.configObject.URLS.apiUrl + 'login', this.user, {observe: 'response'} ).subscribe(
            resp => {
                const helper = new JwtHelperService();
                sessionStorage.LMS_AUTH_TOKEN = resp.headers.get('lms_auth_token');
                const decodedToken = helper.decodeToken( resp.headers.get('lms_auth_token') );

                sessionStorage.cwid = decodedToken.sub.toUpperCase();
                sessionStorage.role = decodedToken.role;
                sessionStorage.division = decodedToken.division;

                //Mark SSO Off & GENERALEVENTS.getPostLoginDetails();
                if ( sessionStorage.redirectRoute == null || sessionStorage.redirectRoute == undefined ) {
                    this.router.navigateByUrl('/home');
                } else {
                    this.router.navigateByUrl( sessionStorage.redirectRoute );
                }
                this.user = {
                    "cwid": null,"password": null
                }
            },
            error =>{
                console.log('error body ' + JSON.stringify(error.error));
                if(error.error.errCode === 401){
                    this.authenticationError = true;
                    this.user = {
                        "cwid": null,"password": null
                    }
                }                
            }
        );
    };	//end of submitLoginForm

}
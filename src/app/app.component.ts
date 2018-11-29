//import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Component, TemplateRef, Directive, Input, ViewChild, HostListener} from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { JwtHelperService } from '@auth0/angular-jwt';

import { AppConfigService } from 'src/app/shared/app.config';
import { generalEventsService } from 'src/app/shared/services/generalEvents.service';

import { forkJoin } from 'rxjs';

import $ from 'jquery';

import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { ModalContentComponent } from 'src/app/shared/modal/modalForLearning/modal.component';

@Component({
  	selector: 'app-root',
  	templateUrl: './app.component.html',
  	styleUrls: ['./app.component.css']
})
export class AppComponent {
  
    configObject : any = {};
    rootUserObect: any = {};
    ssoValue : boolean = false;
    notificationAndCartCount : any = {};
    resizeTimeout : any;

	constructor(    private router : Router, 
                    private http: HttpClient, 
                    private appConfigService: AppConfigService, 
                    private generalEventsServiceObj : generalEventsService,
                    private modalService: BsModalService ) {
        this.configObject = this.appConfigService.getAppConfigObject();
    };  //end of constructor

    ngOnInit(){
        var browserLang=navigator.language.split('-')[0];
        if(browserLang!="de"&&browserLang!="en")
            browserLang = "en";

        this.http.get('assets/translations/'+browserLang+'.json').subscribe( (resp:any) => {
            //Set translation in Service to be available for all components
            this.generalEventsServiceObj.setTranslationJSONInService( resp );
            //Trigger event for all components to capture changed translation
            console.log('app commponent ' + resp.navbarDocumentOrder);
            this.generalEventsServiceObj.callToTriggerTranslationChange( resp );
        });
        var userObject = {  "cwid": "EMMJG" };
        this.http.post( this.configObject.URLS.apiUrl + 'login', userObject, {observe: 'response'} ).subscribe(
            (resp : any) => {
                const helper = new JwtHelperService();
                sessionStorage.LMS_AUTH_TOKEN = resp.headers.get('lms_auth_token');
                const decodedToken = helper.decodeToken( resp.headers.get('lms_auth_token') )

                if( resp.body.authenticated ){
                    sessionStorage.cwid = decodedToken.sub.toUpperCase();
                    sessionStorage.role = decodedToken.role;
                    sessionStorage.division = decodedToken.division;
                    if ( sessionStorage.redirectRoute == null || sessionStorage.redirectRoute == undefined ) {
                        this.router.navigateByUrl('/home');
                    } else {
                        this.router.navigateByUrl( sessionStorage.redirectRoute );
                    }
                    forkJoin(
                        this.http.get( this.configObject.URLS.apiUrl + this.configObject.URLS.SHOPPINGCARTCOUNT + sessionStorage.cwid ),
                        this.http.get( this.configObject.URLS.apiUrl + this.configObject.URLS.LIBNOTIFICATIONMASTERURL + this.configObject.URLS.CURRENTNOTIFICATIONS )
                    ).subscribe(([res1, res2]) => {
                        this.notificationAndCartCount.cartCount = res1;
                        this.notificationAndCartCount.lownotificationbanner = res2["0"];
                        this.notificationAndCartCount.highnotificationbanner = res2["1"];
                        this.notificationAndCartCount.selectedLanuage = browserLang;
                    });
                    this.ssoValue = true;
                }else{
                    this.router.navigateByUrl('/login');
                    this.ssoValue = false;
                    //Mark SSO Off
                }
            },
            error =>{
                if ( null == sessionStorage.LMS_AUTH_TOKEN || "" == sessionStorage.LMS_AUTH_TOKEN) {
                    this.router.navigateByUrl('/login');
                } else {
                    const helper = new JwtHelperService();
                    const decodedToken = helper.decodeToken( sessionStorage.LMS_AUTH_TOKEN );
                    sessionStorage.cwid = decodedToken.sub.toUpperCase();
                    sessionStorage.role = decodedToken.role;
                    sessionStorage.division = decodedToken.division;

                    //Mark SSO Off GENERALEVENTS.getPostLoginDetails();                    
                    if ( sessionStorage.redirectRoute == null || sessionStorage.redirectRoute == undefined ) {
                        this.router.navigateByUrl('/home');
                    } else {
                        this.router.navigateByUrl( sessionStorage.redirectRoute );
                    }
                }
            }
        );
        this.generalEventsServiceObj.invokeEvent.subscribe(value => {
            this.notificationAndCartCount.cartCount = value.cartCount
        });
        this.generalEventsServiceObj.scrollToTopRootFunc.subscribe(value => {
            this.componentRef.directiveRef.scrollToTop();
        });
        $("#mainScrollWrapper").height( $(window).height() );
    };  //end of ngOnInit

    @HostListener('window:resize')
    onWindowResize() {
        //debounce resize, wait for resize to finish before doing stuff
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        this.resizeTimeout = setTimeout((() => {
            $("#mainScrollWrapper").height( $(window).height() );
        }).bind(this), 500);
    };  //end of resie function to reset the height for scrollbar

    @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;
    @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective;

    mainScroll(evt){
        var currentPosition = this.componentRef.directiveRef.geometry();
        //currentPosition - - - > {"x":0,"y":570,"w":1921,"h":1217}
        if( currentPosition.y >= 10 ){
            if(!$('.libraryMainContainer').hasClass('stickyHeader')){
                $('.libraryMainContainer').addClass('stickyHeader')
            }
        }else{
            $('.libraryMainContainer').removeClass('stickyHeader');
        }
        
        if( currentPosition.y >= (currentPosition.h-1000) ){
            this.generalEventsServiceObj.triggerAutoExtension('anshit');
        }
    };  //end of mainScroll

    scrollTop(){
        this.componentRef.directiveRef.scrollToTop(0,1500);
    }
}
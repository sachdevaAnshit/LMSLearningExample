import { Component } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { AppConfigService } from 'src/app/shared/app.config';
import $ from 'jquery';

@Component({
    templateUrl: './documentOrder.component.html',
    styleUrls : ['./documentOrder.component.css']
})

export class DocumentOrderComponent {
  	
  	configObject : any = {};
	tabToShow : string = "journalArticle";
	docOrderObj : any = {
		"literatureType":"",
		"identifierType":"DOI",
		"identifier":"",
		"journalTitle":"",
		"issn":"",
		"journalArticleYear":"",
		"volume":"",
		"issue":"",
		"journalArticleStartPage":"",
		"journalArticleEndPage":"",
		"articleTitle":"",
		"articleAuthors":"",
		"bookTitle":"",
		"bookISBN":"",
		"bookAuthors":"",
		"bookYear":"",
		"edition":"",
		"bookPublisher":"",
		"bookPartStartPage":"",
		"bookPartEndPage":"",
		"chapterTitle":"",
		"chapterAuthors":"",
		"dissertationTitle":"",
		"dissertationISBN":"",
		"dissertationAuthors":"",
		"dissertationYear":"",
		"institution":"",
		"dissertationPublisher":"",
		"countryCode":"DE",
		"patentNumber":"",
		"kindCode":"",
		"literatureToReplaceHash":0
	};
	sub : any;

    afuConfig : any = {
        uploadAPI: {
          url:"https://example-file-upload-api"
        }
    };

	showLiteratureSearch : boolean = true;
	showAmbigousList : boolean = false;
	uploadExcelSuccess : boolean = false;
	uploadExcelFailed : boolean = false;
	showExcelProgress : boolean = false;
	notFoundError : boolean = false;
	ambigousList : any;
	sessionInitialLength : number;
	totalAmbigousLists : any;
	buttonClicked : boolean;
	formValidationMessages  : boolean;	
	commonError : boolean;
	yearNotValid : boolean;

	constructor( private http: HttpClient, private router : Router, private appConfigService: AppConfigService, private location : Location ) {
		this.configObject = this.appConfigService.getAppConfigObject(); 
	}

    ngOnInit(){

        $(document).on("click","#anshit",function(){
            alert('yes');
        });
        $('ul li').mouseenter(function(){
            var pos = $(this).position();
            $(this).find('div').css('top', (pos.top)+50 + 'px').fadeIn();
        }).mouseleave(function(){
            $(this).find('div').fadeOut();
        });

	    sessionStorage.redirectRoute = "/documentOrder";

        /*this.sub = this.router.routerState.root.queryParams.subscribe(params => {
	        // Defaults to 0 if no query param provided.
	        //this.page = +params['page'] || 0;
	        //alert('para = ' + JSON.stringify(params));
		});*/
		this.router.routerState.root.queryParams.subscribe(params => {
        	//alert(JSON.stringify(params)); // popular
      	});
		/*
		http://localhost:8090/BayerLibraryWeb/documentOrder?ctx_ver=Z39.88-2004&amp;ctx_enc=info:ofi/enc:UTF-8&amp;url_ver=Z39.88-2004&amp;rfr_id=info:sid/Elsevier:SD&amp;svc_val_fmt=info:ofi/fmt:kev:mtx:sch_svc&amp;rft_val_fmt=info:ofi/fmt:kev:mtx:journal&amp;rft.aulast=VERLEYSEN&amp;rft.auinit=F&amp;rft.date=2016&amp;rft.issn=17511577&amp;rft.volume=10&amp;rft.issue=1&amp;rft.spage=254&amp;rft.epage=272&amp;rft.title=Journal%20of%20Informetrics&amp;rft.atitle=Clustering%20by%20publication%20patterns%20of%20senior%20authors%20in%20the%20social%20sciences%20and%20humanities&amp;rft_id=info:doi/10.1016/j.joi.2016.01.004
		*/
    }

    orderLiteratureSearch( identifierForm, mainForm, identifierID, mainFormID, literatureType, literatureSearchObject ){
    	literatureSearchObject.literatureType = literatureType;

    	this.buttonClicked = true;
        this.formValidationMessages = false;
        this.commonError = false;
        this.yearNotValid = true;

        let yearTocheck, $emptyFields;
        if (literatureType == "JOURNAL_ARTICLE") {
            yearTocheck = literatureSearchObject.journalArticleYear
        } else if (literatureType == "DISSERTATION") {
            yearTocheck = literatureSearchObject.dissertationYear
        } else if (literatureType == "BOOK" || literatureType == "BOOK_PART") {
            yearTocheck = literatureSearchObject.bookYear
        }
        if (yearTocheck != null && yearTocheck != "")
            this.yearNotValid = /^\d{4}$/.test(yearTocheck);
        if (!literatureSearchObject.identifier) {
            $emptyFields = $('#' + mainFormID + " input").filter(function() {
                return $.trim($(this).val()).length === 0;
            })
            if ($emptyFields.length != $('#' + mainFormID + " input").length) {
                /*if (mainForm.$invalid) {
                if (false) {
                    this.formValidationMessages = true;
                    this.commonError = false
                } else {*/
                    this.formValidationMessages = this.commonError = false;
                    if (this.yearNotValid)
                        this.hitAPIForDocBoardLiteratureSearch(literatureSearchObject)
                //}
            } else {
                this.formValidationMessages = false;
                this.commonError = true;
            }
        } else {
            if (this.yearNotValid)
                this.hitAPIForDocBoardLiteratureSearch(literatureSearchObject)
        }
    };	//end of orderLiteratureSearch

    handleDocBoardURLResponse( response ){
    	let sessionDataInAarrayFormat : any;
    	/*apiService.appUsageIncrement($rootScope.config.url + URLS.getURLS().ADMINMGMTAPPLICATIONUSAGEADD, sessionStorage.LMS_AUTH_TOKEN, sessionStorage.division, "Docboard Search");*/
    	if ( typeof response.AmbiguousList != undefined && response.AmbiguousList != null ) {
    		this.showAmbigousList = true;
            this.showLiteratureSearch = false;
            this.ambigousList = response.AmbiguousList;
            if ( typeof sessionStorage.documentList == undefined || sessionStorage.documentList == null ) {
                this.sessionInitialLength = 0
            } else {
                this.sessionInitialLength = JSON.parse(sessionStorage.documentList).length
            }
            this.totalAmbigousLists = 1;
        } else if (typeof response.CompleteList != undefined && response.CompleteList != null ) {
        	if (typeof sessionStorage.documentList == undefined || sessionStorage.documentList == null ) {
                sessionDataInAarrayFormat = response.CompleteList;
                sessionStorage.documentList = JSON.stringify( sessionDataInAarrayFormat );
            } else {
                sessionDataInAarrayFormat = JSON.parse(sessionStorage.documentList);
                sessionDataInAarrayFormat.push(response.CompleteList[0]);
                sessionStorage.documentList = JSON.stringify( sessionDataInAarrayFormat );
            }
            /*$location.search({});
            $location.path('/documentList')*/
        } else {
            this.notFoundError = true
        }
    };	//end of handleDocBoardURLResponse

    hitAPIForDocBoardLiteratureSearch( passedObj ){
    	passedObj.cwid = sessionStorage.cwid;	    
	    this.http.post( this.configObject.URLS.apiUrl +  this.configObject.URLS.DOCBOARDSEARCHURL, passedObj ).subscribe(
		    resp => {
	    		this.handleDocBoardURLResponse(resp);
	    	},
	    	err =>{
	    		alert('error');
	    	}
	    );
    };	//end of hitAPIForDocBoardLiteratureSearch
 
    selectTab( newTab ){
    	this.tabToShow = newTab;
    }

    getSelectedTabStatus( tabToCheck ){
    	return this.tabToShow === tabToCheck;
    }

    /* getFile(){
    	alert('getFile - - ');
        this.location.go('assets/excel_template/Bulk_Upload_Template_v3.xlsm')
    	//window.location =  '/*';
    }*/
}
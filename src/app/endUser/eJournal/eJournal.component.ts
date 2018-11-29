import { Component } from '@angular/core';
import { Router  } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppConfigService } from 'src/app/shared/app.config';

@Component({
	templateUrl: './eJournal.component.html',
	styleUrls : ['./eJournal.component.css']
})

export class EJournalComponent {
	
    eJournalBandsData : any = {};
    configObject : any = {};
    currentPage: any = {};
    itemsPerPage : number;
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

    constructor( private http: HttpClient, private appConfigService: AppConfigService ){
        this.configObject = this.appConfigService.getAppConfigObject();        
    };  //end of constructor

    ngOnInit(){
        sessionStorage.redirectRoute = "/eJournals";
        forkJoin(
            this.http.get( this.configObject.URLS.apiUrl + 'recommended?cwid=' + sessionStorage.cwid + '&page=1&results=10&source=EJOURNAL' ),
            this.http.get( this.configObject.URLS.apiUrl + 'most-viewed?cwid=' + sessionStorage.cwid + '&page=1&results=10&source=EJOURNAL' ),
            this.http.get( this.configObject.URLS.apiUrl + 'recently-read?cwid=' + sessionStorage.cwid + '&page=1&results=10&source=EJOURNAL' )
        ).subscribe(([res1, res2, res3]) => {
            this.eJournalBandsData.recommendedData = res1;
            this.eJournalBandsData.mostViewedData = res2;
            this.eJournalBandsData.recentlyReadData = res3;
        });
        this.currentPage.mostViewedCurrentPage = 1;
        this.currentPage.recentlyReadCurrentPage = 1;
        this.currentPage.recommendedCurrentPage = 1;        
        this.itemsPerPage = 10;
    };  //end of ngOnInit

    pageChanged(passedFunctionality, pageNumber, itemsPerPage){
        let urlToHit;
        switch(passedFunctionality){
            case "RECOMMENDED":
                urlToHit='recommended';
                break;
            case "RECENTLYREAD":
                urlToHit='recently-read';
                break;
            case "MOSTVIEWED":
                urlToHit='most-viewed';
                break;
        }
        urlToHit += "?cwid="+ sessionStorage.cwid + "&page="+pageNumber+"&results="+itemsPerPage+"&source="+"EJOURNAL";
        this.http.get( this.configObject.URLS.apiUrl + urlToHit ).subscribe(resp => {
            switch(passedFunctionality){
                case "RECOMMENDED":
                    this.eJournalBandsData.recommendedData = resp;   
                    break;
                case "RECENTLYREAD":
                    this.eJournalBandsData.recentlyReadData = resp;
                    break;
                case "MOSTVIEWED":
                    this.eJournalBandsData.mostViewedData = resp;
                    break;
            }
        });         
    };  //end of pagerChanged

}
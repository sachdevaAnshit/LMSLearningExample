import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppConfigService } from 'src/app/shared/app.config';

@Component({
	templateUrl: './eBook.component.html',
	styleUrls : ['./eBook.component.css']
})

export class EBookComponent {
	
    eBookBandsData : any = {};
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
    resizeTimeout : any;

    constructor( private http: HttpClient, private appConfigService: AppConfigService ){
        this.configObject = this.appConfigService.getAppConfigObject();        
    };  //end of constructor

    ngOnInit(){
        sessionStorage.redirectRoute = "/eBooks";
        forkJoin(
            this.http.get( this.configObject.URLS.apiUrl + 'recommended?cwid=' + sessionStorage.cwid + '&page=1&results=10&source=EBOOK' ),
            this.http.get( this.configObject.URLS.apiUrl + 'most-viewed?cwid=' + sessionStorage.cwid + '&page=1&results=10&source=EBOOK' ),
            this.http.get( this.configObject.URLS.apiUrl + 'recently-read?cwid=' + sessionStorage.cwid + '&page=1&results=10&source=EBOOK' )
        ).subscribe(([res1, res2, res3]) => {
            this.eBookBandsData.recommendedData = res1;
            this.eBookBandsData.mostViewedData = res2;
            this.eBookBandsData.recentlyReadData = res3;
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
        urlToHit += "?cwid="+ sessionStorage.cwid + "&page="+pageNumber+"&results="+itemsPerPage+"&source="+"EBOOK";
        this.http.get( this.configObject.URLS.apiUrl + urlToHit ).subscribe(resp => {
            switch(passedFunctionality){
                case "RECOMMENDED":
                    this.eBookBandsData.recommendedData = resp;   
                    break;
                case "RECENTLYREAD":
                    this.eBookBandsData.recentlyReadData = resp;
                    break;
                case "MOSTVIEWED":
                    this.eBookBandsData.mostViewedData = resp;
                    break;
            }
        });         
    };  //end of pagerChanged

    @HostListener('window:resize')
    onWindowResize() {
        console.log('resized');
        //debounce resize, wait for resize to finish before doing stuff
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        this.resizeTimeout = setTimeout((() => {
            console.log('Resize complete');
        }).bind(this), 500);
    }
}
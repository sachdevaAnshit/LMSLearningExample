import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppConfigService } from 'src/app/shared/app.config';
import { apiService } from 'src/app/shared/services/apiService.service';

@Component({
  templateUrl: './myFavorites.component.html',
  styleUrls : ['./myFavorites.component.css']
})

export class MyFavoritesComponent {
  
    myFavoriteData : any = {}
    configObject : any = {};

    layout : string = "grid";
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

    constructor( private http: HttpClient, private appConfigService: AppConfigService, private apiServiceObj : apiService ) {    	
        this.configObject = this.appConfigService.getAppConfigObject();
    }	//end of constructor

    ngOnInit(){
        sessionStorage.redirectRoute = "/myFavorites";

        this.http.get( this.configObject.URLS.apiUrl + this.configObject.URLS.FAVBASEURL + sessionStorage.cwid + "?offset=0&limit=20" ).subscribe(resp => {      		
            this.layout = "list";
            this.myFavoriteData = resp;            
    	});
    }	//end of ngOnInit

    changeLayout( passedLayout ) {
      this.layout = passedLayout;
    };  //end of changeLayout
    
    getFavData(){
        this.http.get( this.configObject.URLS.apiUrl + this.configObject.URLS.FAVBASEURL + sessionStorage.cwid + "?offset=0&limit=20" ).subscribe(resp => {             
            this.myFavoriteData = resp;            
        });
    };  //end of getFavData
}
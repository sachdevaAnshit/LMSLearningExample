import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
	selector : 'library-cart-view-details',
    templateUrl: './libraryCartView.component.html',
    styleUrls : ['./libraryCartView.component.css']
})

export class LibraryCartViewComponent {
  	
  	@Input() cartObj : any;
  	  	
	constructor() {    	
	}	//end of constructor

	ngOnInit(){			
	}
}
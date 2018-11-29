import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class apiService {

	constructor( private http: HttpClient ) { }

	search(term:string) {
		let promise = new Promise((resolve, reject) => {
			this.http.get('https://jsonplaceholder.typicode.com/posts').toPromise().then(
	        	res => { 
	        		resolve(res);
	        	},
	        	msg => { 
		        	reject(msg);
	        	}
	      	);
	  	});
	  	return promise;
	};	//end of search function for service

	searchByObservables(term:string) {
		return this.http.get('https://jsonplaceholder.typicode.com/posts');
	};	//end of search function for service

	putPostData(url, method, data, headers){

	};	//end of putPostData

	downloadBlobExcel( url, dataToDownload ){
		const httpOptions  : any = {
            headers: new HttpHeaders({
                'Content-type': 'application/json',
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            })
        };
        return this.http.post( url, dataToDownload, 
        	{	headers: httpOptions,
        		responseType: 'arraybuffer'
        	});
	};	//end of downloadBlobExcel

};	//end of apiService class
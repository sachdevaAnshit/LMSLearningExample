import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'filterOutSelectedStatus'	
})
export class filterOutSelectedStatusPipe implements PipeTransform {
  	transform(value: any): any {
    	let arrayToCheck = JSON.parse( JSON.stringify(value) );
    	let result = [];

    	for(let i=0;i<arrayToCheck.length;i++){
    		if( arrayToCheck[i].selected ){
    			result.push( arrayToCheck[i] );
    		}
    	}
    	console.log('result up filterOutSelectedStatusPipe = ' + result.length);
    	return result;
  	}
}

@Pipe({
	name: 'filterOutUnSelectedStatus'
})
export class filterOutUnSelectedStatusPipe implements PipeTransform {
  	transform(value: any): any {
    	let arrayToCheck = JSON.parse( JSON.stringify(value) );    	
    	let result = [];

    	for( let i=0; i < arrayToCheck.length; i++ ){
    		var checkTextExistence = true;
			/*if(textToFilterInValue != null && textToFilterInValue != undefined){
				checkTextExistence = (arrayToCheck[i].value.toLowerCase().indexOf(textToFilterInValue.toLowerCase()) != -1);
			}
			 && checkTextExistence
			*/
			if( !arrayToCheck[i].selected){
				result.push(arrayToCheck[i]);
			}
    	}    	
    	console.log('result below filterOutUnSelectedStatusPipe = ' + result.length);    	
    	return result;
  	}
}

@Pipe({
  name: 'filterByString'
})
export class filterByString implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if(!items) return [];
    if(!searchText) return items;
	searchText = searchText.toLowerCase();
	return items.filter( it => {
    	return it.value.toLowerCase().includes(searchText);
    });
   }
}
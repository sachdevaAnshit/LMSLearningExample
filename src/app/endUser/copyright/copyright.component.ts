import { Component, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppConfigService } from 'src/app/shared/app.config';

import $ from 'jquery';

@Component({
	templateUrl: './copyright.component.html',
	styleUrls : ['./copyright.component.css'],
	encapsulation: ViewEncapsulation.None,
})

export class CopyrightComponent {
	
	configObject : any = {};
    excelResponse : any = {};

    hiddenImage : boolean = true;

    fileObj : any = null;
    fileObj1 : any = null;
    fileeBook : any;

    copyrightMatrixData : any = {};
    Object = Object;

	constructor(private http: HttpClient, private appConfigService: AppConfigService){
		this.configObject = this.appConfigService.getAppConfigObject();
		setTimeout(()=>{ 
            $("#imageUploadSection .btn-primary > span").text("Upload");
        }, 5);		
	}

    ngOnInit(){
        sessionStorage.redirectRoute = "/user/copyright";

        $(document).on("click","#anshit",function(){
            alert('yes');
        });
        $('ul li').mouseenter(function(){
            var pos = $(this).position();
            $(this).find('div.interactiveTooltip').css('top', (pos.top)+50 + 'px').fadeIn();
        }).mouseleave(function(){
            $(this).find('div.interactiveTooltip').fadeOut();
        });

        this.http.get( this.configObject.URLS.apiUrl + this.configObject.URLS.COPYRIGHTURL + this.configObject.URLS.MATRIXURL ).subscribe(resp => {
            this.copyrightMatrixData = resp;
        });
	};	//end of ngOnInit

    assignColor( passedColor ){
        console.log('passedColor = ' + passedColor);
        let obj = {
            "background-color": passedColor,
            "width": "100%",
            "height": "100%"
        };
        return obj
    }
	
	fileuploaderFileChange(files: FileList){
        let fData : FormData = new FormData;
        for (var i = 0; i < files.length; i++) {
            fData.append("file", files[i]);
        }
        this.http.post( this.configObject.URLS.apiUrl + this.configObject.URLS.UPLOADEXCELITERATURESEARCHURL + sessionStorage.cwid, fData).subscribe(
            (resp : any ) => {
                alert('got rersp');
                this.excelResponse = resp;
                 /*success(function(response) {
                    $scope.disableAddupdateButton = CONSTANTS.getCONSTANTS().FALSE;
                    $uibModalInstance.close(response)
                }).error(function(responses) {
                    $log.log('Edit/Add eBook error');
                    $scope.disableAddupdateButton = CONSTANTS.getCONSTANTS().FALSE;
                    $rootScope.showLazyLoader = CONSTANTS.getCONSTANTS().FALSE
                }*/
            },
            (err : any ) => {
                alert('error');
            }
        );       
    };  //end of fileuploaderFileChange

    fileuploaderFileChange1(files: FileList){
        var reader = new FileReader();
        // Closure to capture the file information.
        reader.onload = (function(theFile) {
            return function(e) {
                var el = document.getElementById('list');
                var elChild = document.createElement('span');
                elChild.setAttribute("id","coverImageWrapperSpan");
                elChild.innerHTML = ['<img class="thumb" src="', e.target.result, '" title="', escape(theFile.name), '"/>'].join('');
                el.appendChild(elChild);                
            };
        })(files[0]);
        // Read in the image file as a data URL.
        this.fileObj = files[0];
        reader.readAsDataURL(files[0]);
        this.hiddenImage = false;
    };  //end of fileuploaderFileChange1

    removeImage(){        
        $("#list #coverImageWrapperSpan").remove();
        this.fileObj = null;
        this.hiddenImage = true;
    };  //end of removeImage

    initaliseFiletoUploadLater(files:FileList){
        this.fileeBook = files[0];        
        $("#eBookMultiplieLoadExample .btn-primary > span").text( this.fileeBook.name );
    };  //end of initaliseFiletoUploadLater

    hitForDocBoardResults(){
        let fData : FormData = new FormData;
        fData.append("file", this.fileeBook);
        this.http.post( this.configObject.URLS.apiUrl + this.configObject.URLS.UPLOADEXCELITERATURESEARCHURL + sessionStorage.cwid, fData).subscribe(
            (resp : any ) => {
                alert('got rersp');
                this.excelResponse = resp;
            },
            (err : any ) => {
                alert('error');
            }
        );
    };  //end of hitForDocBoardResults

};
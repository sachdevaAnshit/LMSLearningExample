import { Directive, Input, SimpleChanges, HostListener, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/shared/app.config';

@Directive({
    selector: '[access-article]',
})
export class AccessArticleDirective{
    
    @Input('objToLookFor') accessArticle : any = {};
    
    configObject : any = {};

    constructor( private http: HttpClient, private appConfigService: AppConfigService, private elementRef: ElementRef ){
        //console.log('constructor');
        this.configObject = this.appConfigService.getAppConfigObject();
    }

    ngOnInit(){
        //console.log('ngOnInit');
        console.log('ngOnInit Data = ' , JSON.stringify(this.accessArticle));
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let propName in changes) {
            let change = changes[propName];
            if( propName === "objToLookFor"){
                this.accessArticle = change.currentValue;                
            }          
        }
    }

    resolveURLForLiterature( literaturePassed ){
        let flagToCheckForClickableImage : boolean = false;
        let urlToHit : string = "";
        switch (literaturePassed.widgetType) {
            case "eBook" : 
                urlToHit = literaturePassed.fields.book_url;
                flagToCheckForClickableImage = literaturePassed.fields.book_url ? true : false;
                break;
            case "eJournal" : 
                urlToHit = literaturePassed.fields.journal_url;
                flagToCheckForClickableImage = literaturePassed.fields.journal_url ? true : false;
                break;
            case "pubmed" : 
            case "crossref" : 
                if (literaturePassed.literature != undefined) {
                    flagToCheckForClickableImage = (literaturePassed.literature.literatureServices.length != 0 || literaturePassed.literature.literatureServices != null) && (literaturePassed.literature.literatureServices[0].type == "ONLINE");
                    if ( flagToCheckForClickableImage )
                        urlToHit = literaturePassed.literature.literatureServices[0].onlineTargets[0].url
                } else if ( literaturePassed.fields.url ) {
                    flagToCheckForClickableImage = true;
                    urlToHit = literaturePassed.fields.url;
                }
                break;
        }
        let resolvedObjToReturn : any = {};
        resolvedObjToReturn.urlToHit = urlToHit;
        resolvedObjToReturn.flagToCheckForClickableImage = flagToCheckForClickableImage;
        return resolvedObjToReturn;
    }   //end of resolveURLForLiterature

    @HostListener('click') clickEventOnDirective() {
        let resolvedObject : any = this.resolveURLForLiterature( this.accessArticle );

        if( resolvedObject.flagToCheckForClickableImage ){
            var myOnlineAccessObject = {
                "cwid": sessionStorage.cwid,
                "widgetType": this.accessArticle.widgetType,
                "documentId": this.accessArticle.documentId
            };
            //Add the literarture into my online access
            this.http.post( this.configObject.URLS.apiUrl + this.configObject.URLS.ADDONLINEACCESSURL, myOnlineAccessObject ).subscribe(resp => {
                window.open(resolvedObject.urlToHit, '_blank').focus();
            });
        }
    };  //end of clickEventOnDirective

    @HostListener('mouseenter') onMouseEnter() {
        this.elementRef.nativeElement.class = 'red';
    }

    @HostListener('mouseleave') onMouseLeave() {
        this.elementRef.nativeElement.class = 'yellow';
    }
};
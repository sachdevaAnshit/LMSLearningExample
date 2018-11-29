import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { RouterModule, Routes, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

import { ModalModule, CarouselModule, AccordionModule, PaginationModule, TypeaheadModule, PopoverModule, TooltipModule } from 'ngx-bootstrap';
import { UiSwitchModule } from 'angular2-ui-switch';
import { FileUploaderModule } from "ng4-file-upload";
import { AutocompleteModule } from 'ng2-input-autocomplete';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

//Components applicable to all actors of the application
import { LoginComponent } from './login/login.component';

//End User Components
import { HomeComponent } from './endUser/home/home.component';
import { SearchResultComponent } from './endUser/home/searchResult.component';
import { EBookComponent } from './endUser/eBook/eBook.component';
import { EJournalComponent } from './endUser/eJournal/eJournal.component';
import { EJournalAZComponent } from './endUser/eJournal/eJournalAZ.component';
import { DocBoardModule }  from './endUser/docBoard/docBoard.module';
import { CopyrightComponent } from './endUser/copyright/copyright.component';
import { MoreComponent } from './endUser/more/more.component';

import { MyFavoritesComponent } from './endUser/endUserProfile/myFavorites/myFavorites.component';
import { MySavedSearchesComponent } from './endUser/endUserProfile/mySavedSearches/mySavedSearches.component';
//End User Components Ends

//Services
import { AppConfigService } from './shared/app.config';
//Services ends

//Shared Components, Modals, Pipes
import { HeaderComponent } from './shared/components/header/header.component';
import { FilterManagementComponent, FilterAsTilesComponent } from './shared/components/filterManagement/filterManagement.component';
import { BayerGridComponent, BayerListComponent } from './shared/components/gridListDirectives/bayerGridList.component';
import { ModalContentComponent } from './shared/modal/modalForLearning/modal.component';
import { SaveSearchComponent } from './shared/modal/saveSearch/saveSearch.component'
import { filterOutSelectedStatusPipe, filterOutUnSelectedStatusPipe, filterByString } from './shared/pipes/app.pipes';

//Directives for Validations
import { ForbiddenValidatorDirective, abcDefValidatorFunctionDirective } from './shared/directives/validation.directive';

//Custom Directives
import { AccessArticleDirective} from './shared/directives/accessArticleDirective.directive';

const appRoutes: Routes = [  
    //Route for DocBoard and Cart are defined in DobBoardModule
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'eBooks', component: EBookComponent },
    { path: 'eJournals', component: EJournalComponent },
    { path: 'eJournalAZ', component: EJournalAZComponent },
    { path: 'searchresults/:jsonData', component: SearchResultComponent },
    { path: 'more', component: MoreComponent },
    { path: 'mySavedSearches', component: MySavedSearchesComponent },
    { path: 'myFavorites', component: MyFavoritesComponent },
    { path: 'user/copyright', component: CopyrightComponent },    
    { path: '**', redirectTo: '/home' }
];

import { AppComponent } from './app.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        HomeComponent,
        LoginComponent,
        EBookComponent,
        EJournalComponent,
        EJournalAZComponent,
        SearchResultComponent,
        MoreComponent,
        MySavedSearchesComponent,
        MyFavoritesComponent,
        ModalContentComponent,
        FilterManagementComponent,
        FilterAsTilesComponent,
        BayerGridComponent,
        BayerListComponent,
        SaveSearchComponent,
        filterOutSelectedStatusPipe,
        filterOutUnSelectedStatusPipe,
        filterByString,
        ForbiddenValidatorDirective,
        abcDefValidatorFunctionDirective,
        CopyrightComponent,
        AccessArticleDirective
    ],
    entryComponents: [
        ModalContentComponent,
        SaveSearchComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),
        FormsModule,
        ReactiveFormsModule,
        CarouselModule.forRoot(),
        ModalModule.forRoot(),
        AccordionModule.forRoot(),
        PaginationModule.forRoot(),
        TypeaheadModule.forRoot(),
        PopoverModule.forRoot(),
        TooltipModule.forRoot(),
        UiSwitchModule,
        FileUploaderModule,
        AutocompleteModule.forRoot(),
        PerfectScrollbarModule,
        DocBoardModule 
    ],
    providers: [
        AppConfigService,
        {
          provide: PERFECT_SCROLLBAR_CONFIG,
          useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        }
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
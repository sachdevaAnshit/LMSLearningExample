import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  

import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

import { DocumentOrderComponent } from './documentOrder.component';
import { DocumentListComponent } from './documentList.component';
import { LibraryCartComponent } from './libraryCart.component';

//Library Cart View Component
import { LibraryCartViewComponent } from 'src/app/shared/components/libraryCartViewComponent/libraryCartView.component';

const docBoardRoutes : Routes = [
	{ path: 'documentOrder',  component: DocumentOrderComponent },
	{ path: 'documentList', component: DocumentListComponent },
    { path: 'libraryCart', component: LibraryCartComponent }
];

@NgModule({
	imports: [
        CommonModule,
    	RouterModule.forChild( docBoardRoutes ),
        FormsModule,
        ReactiveFormsModule
  	],
  	declarations: [
  		DocumentOrderComponent,
  		DocumentListComponent,
        LibraryCartComponent,
        LibraryCartViewComponent
  	],
  	exports: [
	    RouterModule
	]
})

export class DocBoardModule {

}
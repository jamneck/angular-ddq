import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './material/material.module';
import { MatNativeDateModule } from '@angular/material/core';

import { AppComponent } from './app.component';
import { CreateQuoteComponent } from './create-quote/create-quote.component';

@NgModule({
  imports:      [ 
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    MaterialModule,
    MatNativeDateModule,
    RouterModule.forRoot([
      { path: '', component: CreateQuoteComponent }
    ])
  ],
  declarations: [ AppComponent, CreateQuoteComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomepageKikComponent } from './homepage-kik/homepage-kik.component';
import { LayoutsModule } from './admin/layouts/layouts.module';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

@NgModule({
  declarations: [AppComponent, HomepageKikComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutsModule,
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}

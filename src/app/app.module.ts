import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UploadModule } from '@progress/kendo-angular-upload';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, UploadModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

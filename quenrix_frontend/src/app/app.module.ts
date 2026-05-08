import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

import { SetupProfileComponent } from './setup-profile/setup-profile.component';
import { StatsSectionComponent } from './stats-section/stats-section.component';
import { CoursePreviewSectionComponent } from './course-preview-section/course-preview-section.component';
import { FinalCtaSectionComponent } from './final-cta-section/final-cta-section.component';

@NgModule({
  declarations: [
    AppComponent,
    StatsSectionComponent,
    CoursePreviewSectionComponent,
    FinalCtaSectionComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    SetupProfileComponent,

    // ✅ KEEP THIS (your code)
    MonacoEditorModule.forRoot()
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
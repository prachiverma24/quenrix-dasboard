import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LandingPageComponent } from 'src/app/landing-page/landing-page.component';
import { HeaderComponent } from 'src/app/header/header.component';
import { HeroSectionComponent } from 'src/app/hero-section/hero-section.component';
import { DemoClassesSectionComponent } from 'src/app/demo-classes-section/demo-classes-section.component';
import { NavbarComponent } from 'src/app/navbar/navbar.component';
import { ContactComponent } from 'src/app/contact/contact.component';
import { BlogComponent } from 'src/app/blog/blog.component';
import { FooterComponent } from 'src/app/footer/footer.component';
import { AboutCsmitComponent } from 'src/app/about-csmit/about-csmit.component';
import { CareersComponent } from 'src/app/careers/careers.component';
import { LoginFormComponent } from 'src/app/login-form/login-form.component';
import { ChatbotComponent } from 'src/app/chatbot/chatbot.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginFormComponent }
];

@NgModule({
  declarations: [
    LandingPageComponent,
    HeaderComponent,
    HeroSectionComponent,
    DemoClassesSectionComponent,
    NavbarComponent,
    ContactComponent,
    BlogComponent,
    FooterComponent,
    LoginFormComponent,
    ChatbotComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    CareersComponent,
    AboutCsmitComponent
  ]
})
export class PublicModule { }

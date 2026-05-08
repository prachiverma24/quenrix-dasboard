import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TrainerDashboardComponent } from '../../trainer-dashboard/trainer-dashboard.component';
import { TrainerFormComponent } from '../../trainer-form/trainer-form.component';
import { CourseBatchManagementComponent } from '../../course-batch-management/course-batch-management.component';
import { GenerateAtsResumeComponent } from '../../generate-ats-resume/generate-ats-resume.component';
import { SyntaxshareComponent } from '../../syntaxshare/syntaxshare.component';

const routes: Routes = [
  { path: '', component: TrainerDashboardComponent }
];

@NgModule({
  declarations: [
    TrainerDashboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    TrainerFormComponent,
    CourseBatchManagementComponent,
    GenerateAtsResumeComponent,
    SyntaxshareComponent
  ]
})
export class TrainerModule { }

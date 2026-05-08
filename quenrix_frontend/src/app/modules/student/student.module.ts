import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StudentDashboardComponent } from '../../student-dashboard/student-dashboard.component';
import { CourseBatchManagementComponent } from '../../course-batch-management/course-batch-management.component';
import { GenerateAtsResumeComponent } from '../../generate-ats-resume/generate-ats-resume.component';
import { SyntaxshareComponent } from '../../syntaxshare/syntaxshare.component';
import { AttendExamComponent } from '../../attend-exam/attend-exam.component';

const routes: Routes = [
  { path: '', component: StudentDashboardComponent }
];

@NgModule({
  declarations: [
    StudentDashboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    CourseBatchManagementComponent,
    GenerateAtsResumeComponent,
    SyntaxshareComponent,
    AttendExamComponent
  ]
})
export class StudentModule { }

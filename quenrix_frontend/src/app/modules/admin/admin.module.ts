import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminPanelComponent } from 'src/app/admin-panel/admin-panel.component';
import { UserManagementComponent } from 'src/app/admin-panel/user-management/user-management.component';
import { ManageCourseComponent } from 'src/app/admin-panel/manage-course/manage-course.component';
import { BatchManagementComponent } from 'src/app/admin-panel/batch-management/batch-management.component';
import { CreateSuccessStoryComponent } from 'src/app/admin-panel/create-success-story/create-success-story.component';
import { UploadCareerComponent } from 'src/app/upload-careers/upload-careers.component';
import { CreateCourseComponent } from 'src/app/create-course/create-course.component';
import { CreateJobComponent } from 'src/app/create-job/create-job.component';
import { CreateUserComponent } from 'src/app/create-user/create-user.component';
import { CreateExamComponent } from 'src/app/createexam/createexam.component';
import { AssignUserToBatchComponent } from 'src/app/assign-user-to-batch/assign-user-to-batch.component';
import { CreateBatchComponent } from 'src/app/create-batch/create-batch.component';

const routes: Routes = [
  { path: '', component: AdminPanelComponent }
];

@NgModule({
  declarations: [
    AdminPanelComponent,
    UserManagementComponent,
    ManageCourseComponent,
    BatchManagementComponent,
    CreateSuccessStoryComponent,
    UploadCareerComponent,
    CreateCourseComponent,
    CreateJobComponent,
    CreateUserComponent,
    CreateExamComponent,
    AssignUserToBatchComponent,
    CreateBatchComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class AdminModule { }

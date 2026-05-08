import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeEditorComponent } from '../code-editor/code-editor.component';
import { CodexaaiComponent } from '../codexaai/codexaai.component';
import { QuestionsComponent } from '../questions/questions.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, QuestionsComponent, CodeEditorComponent, CodexaaiComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

}
